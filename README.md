# Guardian Veil - Security & Compliance AI Assistant

Guardian Veil is an enterprise-grade LLM application designed to act as a proactive shield against data leaks. It scrutinizes user queries in real-time for PII, secrets, and internal data.

## Features
- **PII Redaction & Detection**: Real-time monitoring for SSNs, Credit Cards, and Passwords.
- **Security-First Architecture**: Powered by Gemini 3 Pro with strict system instructions.
- **Datadog Integration**: Instrumented for observability, tracking security blocks and latency.
- **Traffic Generator**: Included script to simulate security threats and validate detection rules.

## Deployment Instructions

### Prerequisites
- Node.js (v18+)
- A Google Cloud Project with Gemini API enabled.
- Datadog Account (for monitoring).

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your environment variables:
   ```bash
   export API_KEY='your-gemini-api-key'
   ```
4. Start the application:
   ```bash
   npm start
   ```

### Running the Traffic Generator
To test the detection rules and generate monitoring data:
```bash
node scripts/traffic_generator.js
```

## Datadog Configuration
The `datadog_config.json` file in the root directory contains:
- **Dashboards**: Visualization of "Safe vs Blocked" traffic.
- **Monitors**: Alerts for spikes in sensitive data detection.
- **SLOs**: Ensuring 99.9% uptime for the security gatekeeper.

**Organization Name:** GuardianVeil-SecOps-Global
