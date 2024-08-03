# platform

## Overview

Lux Finance is the first full-stack, open-source Banking as a Service (BaaS) platform, designed to revolutionize the financial services industry. Our platform enables seamless integrations and interoperability with other regulated banks, breaking down barriers and fostering collaboration in the financial ecosystem.

Built with cutting-edge technology, Lux Finance provides a transparent, secure, and efficient banking solution. It is designed to meet the needs of the next generation of financial services, offering a robust set of features and capabilities that go beyond traditional banking.

### Seamless Integrations
Lux Finance is built with interoperability in mind. Our platform can seamlessly integrate with other regulated banks, allowing for the exchange of data and transactions in a secure and efficient manner. This interoperability opens up new opportunities for collaboration and innovation in the financial services industry.

### Cutting-Edge Technology
We leverage the latest technologies to provide a superior banking experience. From AI and machine learning for predictive analytics and intelligent automation, to blockchain for secure and transparent transactions, Lux Finance is at the forefront of technological innovation in banking.

### Transparent and Secure
Security and transparency are at the core of Lux Finance. Our open-source platform allows for complete transparency, fostering trust among users. At the same time, we employ advanced security measures to ensure that all transactions and data are protected.

### Efficient Banking Solution
Lux Finance is designed to streamline banking operations, making them more efficient and user-friendly. Our platform offers a wide range of features, including multi-currency transactions, payment processing, authentication, email delivery, search functionality, error tracking, and user analytics.

### Next Generation of Financial Services
We're paving the way for the next generation of financial services. Our platform is not just a banking solution, but a complete ecosystem for financial innovation. Whether it's developing new financial products, improving customer service, or driving operational efficiency, Lux Finance provides the tools and capabilities to make it happen.

## Key Features

### Regulatory Compliance
- Class 8 Money Transmission License: CDAX Limited is licensed in the Isle of Man, ensuring full regulatory compliance and operational security.
- Transparency: Our open-source approach promotes transparency and trust, essential for building the financial services of the future.

### Integrations

Lux Finance seamlessly integrates with various financial and technology services, including but not limited to:

- **Currency Cloud**: For handling multi-currency transactions and conversions.
- **Stripe**: For payment processing.
- **Auth0**: For authentication and authorization.
- **SendGrid**: For email delivery.
- **Algolia**: For search functionality.
- **Sentry**: For error tracking and monitoring.
- **Google Analytics**: For tracking and analytics.

### Open Source

- Full Stack Solution: From front-end interfaces to back-end infrastructure, Lux Finance offers a complete banking solution.
- Community Driven: Our platform is built and maintained by a vibrant community of developers, ensuring continuous improvement and innovation.
- Customizable: Easily extend and customize the platform to meet specific business needs.

### Security and Reliability

- MPC Operations: Multi-party computation (MPC) for enhanced security and decentralized key management.
- Decentralized Block Confirmations: Secure and reliable transaction confirmations leveraging blockchain technology.
- API-Driven: Robust APIs for seamless integration and interoperability with other systems and services.

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
