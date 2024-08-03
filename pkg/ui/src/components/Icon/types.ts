export type TIconSizes =
  | 'xxs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'xxxl';

export interface IIconProps {
  variant: TIconVariants;
  color?: string;
  onClick?: () => void;
  size?: TIconSizes;
  style?: React.CSSProperties;
}

export type TIconVariants =
  | 'lm-dashboard'
  | 'lm-document-text'
  | 'lm-trash-bin-can'
  | 'lm-camera'
  | 'lm-gallery'
  | 'lm-user-id'
  | 'lm-face-scan-square'
  | 'lm-card-3'
  | 'lm-chevron-right'
  | 'lm-scan-bar-code'
  | 'lm-chevron-left'
  | 'lm-calendar'
  | 'lm-check'
  | 'lm-arrow-up'
  | 'lm-arrow-down'
  | 'lm-alert'
  | 'lm-alert-filled'
  | 'lm-info'
  | 'lm-info-filled'
  | 'lm-tunning'
  | 'lm-download'
  | 'lm-settings'
  | 'lm-logout'
  | 'lm-open'
  | 'lm-chevron-up'
  | 'lm-chevron-down'
  | 'lm-resubmissions'
  | 'lm-recoveries'
  | 'columns'
  | 'drag'
  | 'cigarette'
  | 'dashboard'
  | 'open'
  | 'book-minimalistic'
  | 'k'
  | 'accessibility'
  | 'accumulator'
  | 'add-folder'
  | 'adhesive-plaster-2'
  | 'adhesive-plaster'
  | 'airbuds-case-charge'
  | 'airbuds-case-minimalistic'
  | 'airbuds-case-open'
  | 'airbuds-case'
  | 'airbuds-charge'
  | 'airbuds-check'
  | 'airbuds-left'
  | 'airbuds-remove'
  | 'airbuds-right'
  | 'airbuds'
  | 'alarm-add'
  | 'alarm-pause'
  | 'alarm-play'
  | 'alarm-remove'
  | 'alarm-sleep'
  | 'alarm-turn-off'
  | 'alarm'
  | 'album'
  | 'align-bottom'
  | 'align-horizonta-spacing'
  | 'align-horizontal-center'
  | 'align-left'
  | 'align-right'
  | 'align-top'
  | 'align-vertical-center'
  | 'align-vertical-spacing'
  | 'alt-arrow-down'
  | 'alt-arrow-left'
  | 'alt-arrow-right'
  | 'alt-arrow-up'
  | 'archive-down-1'
  | 'archive-down'
  | 'archive-up-1'
  | 'archive-up'
  | 'archive'
  | 'archived-minimalistic'
  | 'archived'
  | 'armchair-2'
  | 'armchair'
  | 'arrow-down'
  | 'arrow-left-down'
  | 'arrow-left-up'
  | 'arrow-left'
  | 'arrow-right-down'
  | 'arrow-right-up'
  | 'arrow-right'
  | 'arrow-to-down-left'
  | 'arrow-to-down-right'
  | 'arrow-to-top-left'
  | 'arrow-to-top-right'
  | 'arrow-up'
  | 'asteroid'
  | 'atom'
  | 'augmented-reality'
  | 'backpack'
  | 'backspace'
  | 'bacteria'
  | 'bag-2'
  | 'bag-3'
  | 'bag-4'
  | 'bag-5'
  | 'bag-check'
  | 'bag-cross'
  | 'bag-heart'
  | 'bag-music-2'
  | 'bag-music'
  | 'bag-smile'
  | 'bag'
  | 'balloon'
  | 'balls'
  | 'banknote-2'
  | 'banknote'
  | 'bar-chair'
  | 'basketball'
  | 'bath'
  | 'battery-charge-minimalistic'
  | 'battery-charge'
  | 'battery-full-minimalistic'
  | 'battery-full'
  | 'battery-half-minimalistic'
  | 'battery-half'
  | 'battery-low-minimalistic'
  | 'battery-low'
  | 'bed-1'
  | 'bed'
  | 'bedside-table-2'
  | 'bedside-table-3'
  | 'bedside-table-4'
  | 'bedside-table'
  | 'bell-bing'
  | 'bell-off'
  | 'bell'
  | 'benzene-ring'
  | 'bicycling-round'
  | 'bicycling'
  | 'bill-check'
  | 'bill-cross'
  | 'bill-list'
  | 'bill-1'
  | 'bill'
  | 'black-hole-2'
  | 'black-hole-3'
  | 'black-hole'
  | 'bluetooth-circle'
  | 'bluetooth-square'
  | 'bluetooth-wave'
  | 'bluetooth'
  | 'body-location'
  | 'body-shape-minimalistic'
  | 'body-shape'
  | 'body'
  | 'bolt-circle'
  | 'bolt'
  | 'bomb'
  | 'bomb-minimalistic'
  | 'bomb1'
  | 'bone-broken'
  | 'bone-crack'
  | 'bone'
  | 'bones'
  | 'bonfire'
  | 'book-2'
  | 'book-bookmark-minimalistic'
  | 'book-bookmark'
  | 'book'
  | 'bookmark-circle'
  | 'bookmark-opened'
  | 'bookmark-square-minimalistic'
  | 'bookmark-square'
  | 'bookmark'
  | 'boombox'
  | 'bottle'
  | 'bowling'
  | 'box-minimalistic'
  | 'box'
  | 'branching-paths-down'
  | 'branching-paths-up'
  | 'broom'
  | 'bug-minimalistic'
  | 'bug'
  | 'buildings-2'
  | 'buildings-3'
  | 'buildings'
  | 'bus'
  | 'calculator-minimalistic'
  | 'calculator'
  | 'calendar-add'
  | 'calendar-date'
  | 'calendar-mark'
  | 'calendar-minimalistic'
  | 'calendar-search'
  | 'calendar'
  | 'call-cancel-rounded'
  | 'call-cancel'
  | 'call-chat-rounded'
  | 'call-chat'
  | 'call-dropped-rounded'
  | 'call-dropped'
  | 'call-medicine-rounded'
  | 'call-medicine'
  | 'camera-add'
  | 'camera-minimalistic'
  | 'camera-rotate'
  | 'camera-square'
  | 'camera'
  | 'card-2'
  | 'card-recive'
  | 'card-search'
  | 'card-send'
  | 'card-transfer'
  | 'card-wallet'
  | 'card'
  | 'cart-2'
  | 'cart-3'
  | 'cart-4'
  | 'cart-5'
  | 'cart-check'
  | 'cart-cross'
  | 'cart-large-2'
  | 'cart-large-3'
  | 'cart-large-4'
  | 'cart-large-minimalistic'
  | 'cart-large'
  | 'cart-plus'
  | 'cart'
  | 'case-minimalistic'
  | 'case-round-minimalistic'
  | 'case-round'
  | 'case'
  | 'cash-out'
  | 'cassette-2'
  | 'cassette'
  | 'cat'
  | 'chair-2'
  | 'chair'
  | 'chandelier'
  | 'chart-2'
  | 'chart-square'
  | 'chart'
  | 'chat-square-arrow'
  | 'chat-square-call'
  | 'chat-square-check'
  | 'chat-square-code'
  | 'chat-square-like'
  | 'chat-square'
  | 'chat-round-call'
  | 'chat-round-check'
  | 'chat-round-dots'
  | 'chat-round-like'
  | 'chat-round-line'
  | 'chat-round-money'
  | 'chat-round-unread'
  | 'chat-round-video'
  | 'chat-round'
  | 'chat-square-2'
  | 'chat-square-dots'
  | 'chat-square-line'
  | 'chat-square-unread'
  | 'check-circle'
  | 'check-square'
  | 'check'
  | 'checklist-minimalistic'
  | 'checklist'
  | 'chef-hat-heart'
  | 'chef-hat-minimalistic'
  | 'chef-hat'
  | 'circle-bottom-down'
  | 'circle-bottom-up'
  | 'circle-top-down'
  | 'circle-top-up'
  | 'city'
  | 'clapperboard-edit'
  | 'clapperboard-open-play'
  | 'clapperboard-open'
  | 'clapperboard-play'
  | 'clapperboard-text'
  | 'clapperboard'
  | 'clipboard-add'
  | 'clipboard-check'
  | 'clipboard-heart'
  | 'clipboard-list'
  | 'clipboard-remove'
  | 'clipboard-text'
  | 'clipboard'
  | 'clock-circle'
  | 'clock-square'
  | 'closet-2'
  | 'closet'
  | 'cloud-bolt-minimalistic'
  | 'cloud-bolt'
  | 'cloud-check'
  | 'cloud-download'
  | 'cloud-file'
  | 'cloud-minus'
  | 'cloud-plus'
  | 'cloud-rain'
  | 'cloud-snowfall-minimalistic'
  | 'cloud-snowfall'
  | 'cloud-storage'
  | 'cloud-storm'
  | 'cloud-sun-1'
  | 'cloud-sun'
  | 'cloud-upload'
  | 'cloud-waterdrop'
  | 'cloud-waterdrops'
  | 'cloud'
  | 'clouds'
  | 'cloudy-moon'
  | 'clound-cross'
  | 'code-2'
  | 'code-circle'
  | 'code-file'
  | 'code-scan'
  | 'code-square'
  | 'code'
  | 'colour-tuneing'
  | 'command'
  | 'compass-big'
  | 'compass-square'
  | 'compass'
  | 'condicioner-2'
  | 'condicioner'
  | 'confetti-minimalistic'
  | 'confetti'
  | 'confounded-circle'
  | 'confounded-square'
  | 'copy'
  | 'copyright'
  | 'corkscrew'
  | 'cosmetic'
  | 'course-down'
  | 'course-up'
  | 'cpu-bolt'
  | 'cpu'
  | 'creative-commons'
  | 'crop-minimalistic'
  | 'crop'
  | 'cross-circle'
  | 'cross-square'
  | 'cross'
  | 'crown-line'
  | 'crown-minimalistic'
  | 'crown-star'
  | 'crown'
  | 'cup-first'
  | 'cup-hot'
  | 'cup-music'
  | 'cup-paper'
  | 'cup-star'
  | 'cup-1'
  | 'cup'
  | 'cursor-square'
  | 'cursor'
  | 'danger-triangle'
  | 'danger'
  | 'database'
  | 'delivery'
  | 'devices'
  | 'diagram-down'
  | 'diagram-up'
  | 'diploma-verified'
  | 'diploma'
  | 'diskette'
  | 'dislike'
  | 'display'
  | 'dna'
  | 'document-add'
  | 'document-medicine'
  | 'document-text'
  | 'document-1'
  | 'document'
  | 'documents-minimalistic'
  | 'documents'
  | 'dollar-minimalistic'
  | 'dollar'
  | 'donut-bitten'
  | 'donut'
  | 'double-alt-arrow-down'
  | 'double-alt-arrow-left'
  | 'double-alt-arrow-right'
  | 'double-alt-arrow-up'
  | 'double-check'
  | 'download-minimalistic'
  | 'download-square'
  | 'download-twice-square'
  | 'download'
  | 'dropper-2'
  | 'dropper-3'
  | 'dropper-minimalistic-2'
  | 'dropper-minimalistic'
  | 'dropper'
  | 'dumbbell-large-minimalistic'
  | 'dumbbell-large'
  | 'dumbbell-small'
  | 'dumbbell'
  | 'dumbbells-2'
  | 'dumbbells'
  | 'earth'
  | 'electric-refueling'
  | 'emoji-funny-circle'
  | 'emoji-funny-square'
  | 'end-call-rounded'
  | 'end-call'
  | 'eraser-circle'
  | 'eraser-square'
  | 'eraser'
  | 'euro'
  | 'exclamation-circle'
  | 'exclamation-square'
  | 'exit'
  | 'explicit'
  | 'export'
  | 'expressionless-circle'
  | 'expressionless-square'
  | 'eye-closed'
  | 'eye-scan'
  | 'eye'
  | 'face-scan-circle'
  | 'face-scan-square'
  | 'facemask-circle'
  | 'facemask-square'
  | 'feed'
  | 'ferris-wheel'
  | 'figma-file'
  | 'figma'
  | 'file-check'
  | 'file-corrupted'
  | 'file-download'
  | 'file-favourite'
  | 'file-left'
  | 'file-remove'
  | 'file-right'
  | 'file-send'
  | 'file-smile-_'
  | 'file-text'
  | 'file'
  | 'filter'
  | 'filters'
  | 'fire-minimalistic'
  | 'fire-square'
  | 'fire'
  | 'flag-2'
  | 'flag'
  | 'flame'
  | 'flashlight-on'
  | 'flashlight'
  | 'flip-horizontal'
  | 'flip-vertical'
  | 'floor-lamp-minimalistic'
  | 'floor-lamp'
  | 'fog'
  | 'folder-2'
  | 'folder-check'
  | 'folder-cloud'
  | 'folder-error'
  | 'folder-favourite-bookmark'
  | 'folder-favourite-star'
  | 'folder-open'
  | 'folder-path-connect'
  | 'folder-security'
  | 'folder-with-files'
  | 'folder'
  | 'football'
  | 'forbidden-circle'
  | 'forbidden'
  | 'forward-2'
  | 'forward-1'
  | 'forward'
  | 'fridge'
  | 'fuel'
  | 'full-screen-circle'
  | 'full-screen-square'
  | 'full-screen'
  | 'gallery-add'
  | 'gallery-check'
  | 'gallery-circle'
  | 'gallery-download'
  | 'gallery-edit'
  | 'gallery-favourite'
  | 'gallery-minimalistic'
  | 'gallery-remove'
  | 'gallery-round'
  | 'gallery-send'
  | 'gallery-wide'
  | 'gallery'
  | 'gameboy'
  | 'gamepad-charge'
  | 'gamepad-minimalistic'
  | 'gamepad-no-charge'
  | 'gamepad-old'
  | 'gamepad'
  | 'garage'
  | 'gas-station'
  | 'ghost-smile'
  | 'ghost'
  | 'gift'
  | 'glasses'
  | 'global'
  | 'globus'
  | 'golf'
  | 'gps'
  | 'graph-down-new'
  | 'graph-down'
  | 'graph-new-up'
  | 'graph-new'
  | 'graph-up'
  | 'graph'
  | 'hamburger-menu'
  | 'hand-heart'
  | 'hand-money'
  | 'hand-pills'
  | 'hand-shake'
  | 'hand-stars'
  | 'hanger-2'
  | 'hanger'
  | 'hashtag-chat'
  | 'hashtag-circle'
  | 'hashtag-square'
  | 'hashtag'
  | 'headphones-round-sound'
  | 'headphones-round'
  | 'headphones-square-sound'
  | 'headphones-square'
  | 'health'
  | 'heart-angle'
  | 'heart-broken'
  | 'heart-lock'
  | 'heart-pulse-2'
  | 'heart-pulse'
  | 'heart-shine'
  | 'heart-unlock'
  | 'heart'
  | 'hearts'
  | 'help'
  | 'high-definition'
  | 'high-quality'
  | 'hiking-minimalistic'
  | 'hiking-round'
  | 'hiking'
  | 'history-2'
  | 'history-3'
  | 'history'
  | 'home-2'
  | 'home-add-angle'
  | 'home-add'
  | 'home-angle-2'
  | 'home-angle'
  | 'home-smile-angle'
  | 'home-smile'
  | 'home-wifi-angle'
  | 'home-wifi'
  | 'home-1'
  | 'home'
  | 'hospital'
  | 'hourglass-line'
  | 'hourglass'
  | 'import'
  | 'inbox-archive'
  | 'inbox-in'
  | 'inbox-line'
  | 'inbox-out'
  | 'inbox-unread'
  | 'inbox'
  | 'incognito'
  | 'incoming-call-rounded'
  | 'incoming-call'
  | 'infinity'
  | 'info-circle'
  | 'info-square'
  | 'iphone'
  | 'jar-of-pills-2'
  | 'jar-of-pills'
  | 'key-minimalistic-2'
  | 'key-minimalistic-square-2'
  | 'key-minimalistic-square-3'
  | 'key-minimalistic-square'
  | 'key-minimalistic'
  | 'key-square-2'
  | 'key-square'
  | 'key'
  | 'keyboard'
  | 'kick-scooter'
  | 'ladle'
  | 'lamp'
  | 'layers-minimalistic'
  | 'layers'
  | 'leaf'
  | 'library'
  | 'lightbulb-bolt'
  | 'lightbulb-minimalistic'
  | 'lightbulb'
  | 'lightning'
  | 'like'
  | 'link-broken-minimalistic'
  | 'link-broken'
  | 'link-circle'
  | 'link-minimalistic-2'
  | 'link-minimalistic'
  | 'link-round-angle'
  | 'link-round'
  | 'link-square'
  | 'link'
  | 'list-arrow-down-minimalistic'
  | 'list-arrow-down'
  | 'list-arrow-up-minimalistic'
  | 'list-arrow-up'
  | 'list-check-minimalistic'
  | 'list-check'
  | 'list-cross-minimalistic'
  | 'list-cross'
  | 'list-down'
  | 'list-heart-minimalistic'
  | 'list-heart'
  | 'list-up-minimalistic-1'
  | 'list-up-minimalistic'
  | 'list-up'
  | 'list-1'
  | 'list'
  | 'lock-keyhole-minimalistic-unlocked'
  | 'lock-keyhole-minimalistic'
  | 'lock-keyhole-unlocked'
  | 'lock-keyhole'
  | 'lock-password-unlocked'
  | 'lock-password'
  | 'lock-unlocked'
  | 'lock'
  | 'login-2'
  | 'login-1'
  | 'login'
  | 'logout-2'
  | 'logout-1'
  | 'logout'
  | 'magic-stick-2'
  | 'magic-stick-3'
  | 'magic-stick'
  | 'magnet-wave'
  | 'magnet'
  | 'magnifer-bug'
  | 'magnifer-zoom-in'
  | 'magnifer-zoom-out'
  | 'magnifer'
  | 'map-arrow-down'
  | 'map-arrow-left'
  | 'map-arrow-right'
  | 'map-arrow-square'
  | 'map-arrow-up'
  | 'map-point-add'
  | 'map-point-favourite'
  | 'map-point-hospital'
  | 'map-point-remove'
  | 'map-point-rotate'
  | 'map-point-school'
  | 'map-point-search'
  | 'map-point-wave'
  | 'map-point'
  | 'map'
  | 'mask-happly'
  | 'mask-sad'
  | 'masks'
  | 'maximize-square-2'
  | 'maximize-square-3'
  | 'maximize-square-minimalistic'
  | 'maximize-square'
  | 'maximize'
  | 'medal-ribbon-star'
  | 'medal-ribbon'
  | 'medal-ribbons-star'
  | 'medal-star-circle'
  | 'medal-star-square'
  | 'medal-star'
  | 'medical-kit'
  | 'meditation-round'
  | 'meditation'
  | 'men'
  | 'mention-circle'
  | 'mention-square'
  | 'menu-dots-circle'
  | 'menu-dots-square'
  | 'menu-dots'
  | 'microphone-2'
  | 'microphone-3'
  | 'microphone-large'
  | 'microphone'
  | 'minimalistic-magnifer-bug'
  | 'minimalistic-magnifer-zoom-in'
  | 'minimalistic-magnifer-zoom-out'
  | 'minimalistic-magnifer'
  | 'minimize-square-2'
  | 'minimize-square-3'
  | 'minimize-square-minimalistic'
  | 'minimize-square'
  | 'minimize'
  | 'minus-circle'
  | 'minus-square'
  | 'minus'
  | 'mirror-left'
  | 'mirror-right'
  | 'mirror-1'
  | 'mirror'
  | 'money-bag'
  | 'monitor-camera'
  | 'monitor-smartphone'
  | 'monitor'
  | 'moon-fog'
  | 'moon-sleep'
  | 'moon-stars'
  | 'moon'
  | 'mouse-circle'
  | 'mouse-minimalistic'
  | 'mouse'
  | 'move-to-folder'
  | 'multiple-forward-left'
  | 'multiple-forward-right'
  | 'music-library-2'
  | 'music-library'
  | 'music-note-2'
  | 'music-note-3'
  | 'music-note-4'
  | 'music-note-slider-2'
  | 'music-note-slider'
  | 'music-note'
  | 'music-notes'
  | 'muted'
  | 'notebook-2-1'
  | 'notebook-2'
  | 'notebook-bookmark'
  | 'notebook-minimalistic-1'
  | 'notebook-minimalistic'
  | 'notebook-square'
  | 'notebook-1'
  | 'notebook-21'
  | 'notebook'
  | 'notes-minimalistic'
  | 'notes'
  | 'notification-lines-remove'
  | 'notification-remove'
  | 'notification-unread-lines'
  | 'notification-unread'
  | 'object-scan'
  | 'outgoing-call-rounded'
  | 'outgoing-call'
  | 'oven-mitts-minimalistic'
  | 'oven-mitts'
  | 'paint-roller'
  | 'palette-round'
  | 'palette'
  | 'pallete-2'
  | 'panorama'
  | 'paper-bin'
  | 'paperclip-2'
  | 'paperclip-rounded-2'
  | 'paperclip-rounded'
  | 'paperclip'
  | 'paragraph-spacing'
  | 'passport-minimalistic'
  | 'passport'
  | 'password-minimalistic-input'
  | 'password-minimalistic'
  | 'password'
  | 'pause-circle'
  | 'pause'
  | 'paw'
  | 'pen-2'
  | 'pen-new-round'
  | 'pen-new-square'
  | 'pen'
  | 'perfume'
  | 'phone-calling-rounded'
  | 'phone-calling'
  | 'phone-rounded'
  | 'phone'
  | 'pie-chart-2'
  | 'pie-chart-3'
  | 'pie-chart'
  | 'pill'
  | 'pills-2'
  | 'pills-3'
  | 'pills'
  | 'pin-circle'
  | 'pin-list'
  | 'pin'
  | 'pip-2'
  | 'pip'
  | 'pipette'
  | 'plaaylist-minimalistic'
  | 'plain-2'
  | 'plain-3'
  | 'plain'
  | 'planet-2'
  | 'planet-3'
  | 'planet-4'
  | 'planet'
  | 'plate'
  | 'play-circle'
  | 'play-stream'
  | 'play'
  | 'playback-speed'
  | 'playlist-2'
  | 'playlist-minimalistic-2'
  | 'playlist-minimalistic-3'
  | 'playlist'
  | 'plug-circle'
  | 'plus-circle'
  | 'plus-square'
  | 'plus| minus1'
  | 'plus1'
  | 'podcast'
  | 'point-on-map-perspective'
  | 'point-on-map'
  | 'posts-carousel-horizontal'
  | 'posts-carousel-vertical'
  | 'power'
  | 'presentation-graph'
  | 'printer-2'
  | 'printer-minimalistic'
  | 'printer'
  | 'programming'
  | 'projector'
  | 'pulse-2'
  | 'pulse'
  | 'qr-code'
  | 'question-circle'
  | 'question-square'
  | 'quit-full-screen-circle'
  | 'quit-full-screen-square'
  | 'quit-full-screen'
  | 'quit-pip'
  | 'radar-2'
  | 'radar'
  | 'radial-blur'
  | 'radio-minimalistic'
  | 'radio'
  | 'ranking'
  | 'recive-square'
  | 'recive-twice-square'
  | 'record-circle-1'
  | 'record-circle'
  | 'record-square'
  | 'record-1'
  | 'record-2'
  | 'record'
  | 'reel-2'
  | 'reel'
  | 'refresh-circle-1'
  | 'refresh-circle'
  | 'refresh-square-1'
  | 'refresh-square'
  | 'refresh'
  | 'remote-controller-2'
  | 'remote-controller-minimalistic'
  | 'remote-controller'
  | 'remove-folder'
  | 'reorder-1'
  | 'reorder'
  | 'repeat-one-minimalistic'
  | 'repeat-one'
  | 'repeat'
  | 'reply-2'
  | 'reply'
  | 'restart'
  | 'revote'
  | 'rewind-5-seconds-back'
  | 'rewind-5-seconds-forward'
  | 'rewind-10-seconds-back'
  | 'rewind-10-seconds-forward'
  | 'rewind-15-seconds-back'
  | 'rewind-15-seconds-forward'
  | 'rewind-back-circle'
  | 'rewind-back'
  | 'rewind-forward-circle'
  | 'rewind-forward'
  | 'rocket-2'
  | 'rocket'
  | 'rolling-pin'
  | 'round-alt-arrow-down'
  | 'round-alt-arrow-left'
  | 'round-alt-arrow-right'
  | 'round-alt-arrow-up'
  | 'round-arrow-down'
  | 'round-arrow-left-down'
  | 'round-arrow-left-up'
  | 'round-arrow-left'
  | 'round-arrow-right-down'
  | 'round-arrow-right-up'
  | 'round-arrow-right'
  | 'round-arrow-up'
  | 'round-double-alt-arrow-down'
  | 'round-double-alt-arrow-left'
  | 'round-double-alt-arrow-right'
  | 'round-double-alt-arrow-up'
  | 'round-graph'
  | 'round-sort-horizontal'
  | 'round-sort-vertical'
  | 'round-transfer-diagonal'
  | 'round-transfer-horizontal'
  | 'round-transfer-vertical'
  | 'rounded-dialog'
  | 'rounded-magnifer-bug'
  | 'rounded-magnifer-zoom-in'
  | 'rounded-magnifer-zoom-out'
  | 'rounded-magnifer'
  | 'route'
  | 'routing-2'
  | 'routing-3'
  | 'routing'
  | 'ruble'
  | 'rugby'
  | 'ruler-angular'
  | 'ruler-cross-pen'
  | 'ruler-pen'
  | 'ruler'
  | 'running-2'
  | 'running-round'
  | 'running'
  | 'sad-circle'
  | 'sad-square'
  | 'safe-2'
  | 'safe-circle'
  | 'safe-square'
  | 'sale-square'
  | 'sale'
  | 'satellite'
  | 'scale'
  | 'scanner-2'
  | 'scanner'
  | 'scissors-square'
  | 'scissors'
  | 'scooter'
  | 'screen-share'
  | 'screencast-2'
  | 'screencast'
  | 'sd-card'
  | 'send-square'
  | 'send-twice-square'
  | 'server-2'
  | 'server-minimalistic'
  | 'server-path'
  | 'server-square-cloud'
  | 'server-square-update'
  | 'server-square'
  | 'server'
  | 'settings-minimalistic'
  | 'settings'
  | 'share-circle'
  | 'share'
  | 'shield-check'
  | 'shield-cross'
  | 'shield-keyhole-minimalistic'
  | 'shield-keyhole'
  | 'shield-minimalistic'
  | 'shield-minus'
  | 'shield-network'
  | 'shield-plus'
  | 'shield-star'
  | 'shield-up'
  | 'shield-user'
  | 'shield-warning'
  | 'shield'
  | 'shock-absorber'
  | 'shop-2'
  | 'shop-minimalistic'
  | 'shop'
  | 'shuffle'
  | 'sidebar-code'
  | 'sidebar-minimalistic'
  | 'siderbar'
  | 'signpost-2'
  | 'signpost'
  | 'sim-card-minimalistic'
  | 'sim-card'
  | 'sim-cards'
  | 'siren-rounded'
  | 'siren'
  | 'skateboard'
  | 'skateboarding-round'
  | 'skateboarding'
  | 'skip-next'
  | 'skip-previous'
  | 'skirt'
  | 'slash-circle'
  | 'slash-square'
  | 'sledgehammer'
  | 'sleeping-circle'
  | 'sleeping-square'
  | 'slider-horizontal'
  | 'slider-minimalistic-horizontal'
  | 'slider-vertical-minimalistic'
  | 'slider-vertical'
  | 'smart-home-angle'
  | 'smart-home'
  | 'smart-speaker-2'
  | 'smart-speaker-minimalistic'
  | 'smart-speaker'
  | 'smart-vacuum-cleaner-2'
  | 'smart-vacuum-cleaner'
  | 'smartphone-2'
  | 'smartphone-rotate-2'
  | 'smartphone-rotate-angle'
  | 'smartphone-rotate-orientation'
  | 'smartphone-update'
  | 'smartphone-vibration'
  | 'smartphone'
  | 'smile-circle'
  | 'smile-square'
  | 'snowflake'
  | 'socket'
  | 'sofa-2'
  | 'sofa-3'
  | 'sofa'
  | 'sort-by-alphabet'
  | 'sort-by-time'
  | 'sort-from-bottom-to-top'
  | 'sort-from-top-to-bottom'
  | 'sort-horizontal'
  | 'sort-vertical'
  | 'sort'
  | 'soundwave-1'
  | 'soundwave-2'
  | 'soundwave'
  | 'speaker-minimalistic'
  | 'speaker'
  | 'special-effects'
  | 'spedometer-low'
  | 'spedometer-max'
  | 'spedometer-middle'
  | 'square-academic-cap-2'
  | 'square-academic-cap'
  | 'square-alt-arrow-down'
  | 'square-alt-arrow-left'
  | 'square-alt-arrow-right'
  | 'square-alt-arrow-up'
  | 'square-arrow-down'
  | 'square-arrow-left-down'
  | 'square-arrow-left-up'
  | 'square-arrow-left'
  | 'square-arrow-right-down'
  | 'square-arrow-right-up'
  | 'square-arrow-right'
  | 'square-arrow-up'
  | 'square-bottom-down'
  | 'square-bottom-up'
  | 'square-dialog'
  | 'square-double-alt-arrow-right'
  | 'square-double-alt-arrow-down'
  | 'square-double-alt-arrow-left'
  | 'square-double-alt-arrow-up'
  | 'square-forward'
  | 'square-share-line'
  | 'square-sort-horizontal'
  | 'square-sort-vertical'
  | 'square-top-down'
  | 'square-top-up'
  | 'square-transfer-horizontal'
  | 'square-transfer-vertical'
  | 'ssd-round'
  | 'ssd-square'
  | 'star-angle'
  | 'star-circle'
  | 'star-fall-2'
  | 'star-fall-minimalistic-2'
  | 'star-fall-minimalistic'
  | 'star-fall'
  | 'star-rainbow'
  | 'star-ring'
  | 'star-rings'
  | 'star-shine'
  | 'star-1'
  | 'star'
  | 'stars-line'
  | 'stars-minimalistic'
  | 'stars-1'
  | 'stars'
  | 'station-minimalistic'
  | 'station'
  | 'stethoscope'
  | 'sticker-circle'
  | 'sticker-smile-circle-2'
  | 'sticker-smile-circle'
  | 'sticker-smile-square'
  | 'sticker-square'
  | 'stop-circle'
  | 'stop'
  | 'stopwatch-pause'
  | 'stopwatch-play'
  | 'stopwatch'
  | 'stream'
  | 'streets-map-point'
  | 'streets-navigation'
  | 'streets'
  | 'stretching-round'
  | 'stretching'
  | 'structure'
  | 'subtitles'
  | 'suitcase-lines'
  | 'suitcase-tag'
  | 'suitcase'
  | 'sun-2'
  | 'sun-fog'
  | 'sun'
  | 'sunrise'
  | 'sunset'
  | 'suspension-bolt'
  | 'suspension-cross'
  | 'suspension'
  | 'swimming'
  | 'syringe'
  | 't-shirt'
  | 'tablet'
  | 'tag-horizontal'
  | 'tag-price'
  | 'tag'
  | 'target'
  | 'tea-cup'
  | 'telescope'
  | 'temperature'
  | 'tennis-2'
  | 'tennis'
  | 'test-tube-minimalistic'
  | 'test-tube'
  | 'text-bold-circle'
  | 'text-bold-square'
  | 'text-bold'
  | 'text-circle'
  | 'text-cross-circle'
  | 'text-cross-square'
  | 'text-cross'
  | 'text-field-focus'
  | 'text-field'
  | 'text-italic-circle'
  | 'text-italic-square'
  | 'text-italic'
  | 'text-selection'
  | 'text-square-2'
  | 'text-square'
  | 'text-underline-circle'
  | 'text-underline-cross'
  | 'text-underline'
  | 'text'
  | 'thermometer'
  | 'three-squares'
  | 'ticker-star'
  | 'ticket-sale'
  | 'ticket'
  | 'to-pip'
  | 'tornado-small'
  | 'tornado'
  | 'traffic-economy'
  | 'traffic'
  | 'tram'
  | 'transfer-horizontal'
  | 'transfer-vertical'
  | 'translation-2'
  | 'translation'
  | 'transmission-circle'
  | 'transmission-square'
  | 'transmission'
  | 'trash-bin-2'
  | 'trash-bin-minimalistic-2'
  | 'trash-bin-minimalistic'
  | 'trash-bin-trash'
  | 'treadmill-round'
  | 'treadmill'
  | 'trellis'
  | 'tuning-2'
  | 'tuning-3'
  | 'tuning-4'
  | 'tuning-square-2'
  | 'tuning-square'
  | 'tuning'
  | 'turntable-minimalistic'
  | 'turntable-music-note'
  | 'turntable'
  | 'tv'
  | 'ufo-2'
  | 'ufo-3'
  | 'ufo'
  | 'umbrella'
  | 'undo-left-round-square'
  | 'undo-left-round'
  | 'undo-left-square'
  | 'undo-left'
  | 'undo-right-round-1'
  | 'undo-right-round'
  | 'undo-right-square'
  | 'undo-right'
  | 'upload-minimalistic'
  | 'upload-square'
  | 'upload-track-2'
  | 'upload-track'
  | 'upload-twice-square'
  | 'upload'
  | 'usb-circle'
  | 'usb-square'
  | 'usb-1'
  | 'usb'
  | 'user-block-rounded'
  | 'user-block'
  | 'user-check-rounded'
  | 'user-check'
  | 'user-circle'
  | 'user-cross-rounded'
  | 'user-cross'
  | 'user-hand-up'
  | 'user-hands'
  | 'user-heart-rounded'
  | 'user-heart'
  | 'user-id'
  | 'user-minus-rounded'
  | 'user-minus'
  | 'user-plus-rounded'
  | 'user-plus'
  | 'user-rounded'
  | 'user-speak-rounded'
  | 'user-speak'
  | 'user'
  | 'users-group-rounded'
  | 'users-group-two-rounded'
  | 'verified-check'
  | 'video-frame-2'
  | 'video-frame-cut-2'
  | 'video-frame-cut'
  | 'video-frame-play-horizontal'
  | 'video-frame-play-vertical'
  | 'video-frame-replace'
  | 'video-frame'
  | 'video-library'
  | 'videocamera-add'
  | 'videocamera-record'
  | 'videocamera'
  | 'vinyl-record'
  | 'virus'
  | 'volleyball-2'
  | 'volleyball'
  | 'volume-cross'
  | 'volume-knob'
  | 'volume-loud'
  | 'volume-small'
  | 'volume'
  | 'wad-of-money'
  | 'walking-round'
  | 'walking'
  | 'wallet-2'
  | 'wallet-money'
  | 'wallet'
  | 'wallpaper'
  | 'washing-machine-minimalistic'
  | 'washing-machine'
  | 'watch-round'
  | 'watch-square-minimalistic-charge'
  | 'watch-square-minimalistic'
  | 'watch-square'
  | 'water-sun'
  | 'water'
  | 'waterdrop'
  | 'waterdrops'
  | 'weigher'
  | 'wheel-angle'
  | 'wheel'
  | 'whisk'
  | 'wi-fi-router-minimalistic'
  | 'wi-fi-router-round'
  | 'wi-fi-router'
  | 'widget-2'
  | 'widget-3'
  | 'widget-4'
  | 'widget-5'
  | 'widget-6'
  | 'widget-add'
  | 'widget'
  | 'wind'
  | 'window-frame'
  | 'wineglass-triangle'
  | 'wineglass'
  | 'winrar'
  | 'wireless-charge'
  | 'women'
  | 'xxx'
  | 'zip-file';