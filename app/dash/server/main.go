// Command dashd serves the Lux Financial SPA and proxies /v1/* to bankd.
//
// No nginx/caddy: a ~60-line stdlib static server with SPA fallback plus a
// reverse proxy so the app is same-origin for both the bank API and the IAM
// PKCE flow (bankd mounts /v1/iam as a transparent proxy to lux.id).
package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"path/filepath"
	"strings"
)

func env(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}

func main() {
	dist := env("DIST_DIR", "/app/dist")
	addr := ":" + env("PORT", "3000")
	upstream := env("BANK_UPSTREAM", "http://bankd.lux-bank.svc.cluster.local")

	target, err := url.Parse(upstream)
	if err != nil {
		log.Fatalf("invalid BANK_UPSTREAM %q: %v", upstream, err)
	}
	proxy := httputil.NewSingleHostReverseProxy(target)
	proxy.FlushInterval = -1 // stream responses (SSE-safe)

	index := filepath.Join(dist, "index.html")
	fileServer := http.FileServer(http.Dir(dist))

	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// API + IAM: forward to bankd, preserving the Host it expects.
		if strings.HasPrefix(r.URL.Path, "/v1/") {
			r.Host = target.Host
			proxy.ServeHTTP(w, r)
			return
		}
		// Static assets: serve if the file exists, else SPA fallback.
		clean := filepath.Clean(r.URL.Path)
		if clean != "/" {
			if fp := filepath.Join(dist, clean); fileExists(fp) {
				if strings.HasPrefix(clean, "/assets/") {
					w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
				}
				fileServer.ServeHTTP(w, r)
				return
			}
		}
		w.Header().Set("Cache-Control", "no-cache")
		http.ServeFile(w, r, index)
	})

	log.Printf("dashd: serving %s on %s, proxying /v1 -> %s", dist, addr, upstream)
	srv := &http.Server{Addr: addr, Handler: mux}
	log.Fatal(srv.ListenAndServe())
}

func fileExists(p string) bool {
	info, err := os.Stat(p)
	return err == nil && !info.IsDir()
}
