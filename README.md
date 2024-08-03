# platform

## Overview

Lux Finance is the first full-stack, open-source BaaS platform, enabling seamless integrations and interoperability with other regulated banks. Our platform leverages cutting-edge technology to provide a transparent, secure, and efficient banking solution for the next generation of financial services.

## Key Features

### Regulatory Compliance
- Class 8 Money Transmission License: CDAX Limited is licensed in the Isle of Man, ensuring full regulatory compliance and operational security.
- Transparency: Our open-source approach promotes transparency and trust, essential for building the financial services of the future.

### Integrations

Lux Finance seamlessly integrates with various financial and technology services, including but not limited to:

	•	Currencycloud: Streamline cross-border payments and currency exchange with Currencycloud integration.
	•	Payment Gateways: Support for multiple payment gateways to ensure smooth transactions.
	•	KYC/AML Providers: Integration with leading Know Your Customer (KYC) and Anti-Money Laundering (AML) providers to ensure compliance and security.
	•	Blockchain Networks: Native support for blockchain networks to facilitate digital asset management and transactions.

### Open Source

	•	Full Stack Solution: From front-end interfaces to back-end infrastructure, Lux Finance offers a complete banking solution.
	•	Community Driven: Our platform is built and maintained by a vibrant community of developers, ensuring continuous improvement and innovation.
	•	Customizable: Easily extend and customize the platform to meet specific business needs.

### Security and Reliability

	•	MPC Operations: Multi-party computation (MPC) for enhanced security and decentralized key management.
	•	Decentralized Block Confirmations: Secure and reliable transaction confirmations leveraging blockchain technology.
	•	API-Driven: Robust APIs for seamless integration and interoperability with other systems and services.


## Dev: run locally

Install `pnpm` [like so](https://pnpm.io/installation)

The usual scripts for a Next site, using `pnpm`
```
pnpm install
cd sites/<siteName>
pnpm dev
```

Since "pnpm" is a finger twister, many people alias it to "pn". For example, with `bash`, put `alias pn='pnpm'` in `.bashrc`.

## Architecture

- Next.js 14
- Radix UI Primitives
- Tailwind CSS
- Icons from [Lucide](https://lucide.dev)
- Dark mode with `next-themes`

## Built on the Hanzo React SDK (@hanzo/ui, @hanzo/auth, @hanzo/commerce)

- A potent React framework using Next 14, Tailwind and Radix
- Renders most content from simple 'Block' definitions (in `/src/content` )
- Lives [on GitHub here](https://github.com/hanzoai/react-sdk)
