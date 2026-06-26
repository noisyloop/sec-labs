// Practice exam content for sec-labs — a 90-question CompTIA Security+ (SY0-701)
// style practice test. Distribution matches the official domain weights:
//
//   Domain 1  General Security Concepts                 12%  -> 11 questions
//   Domain 2  Threats, Vulnerabilities & Mitigations    22%  -> 20 questions
//   Domain 3  Security Architecture                      18%  -> 16 questions
//   Domain 4  Security Operations                        28%  -> 25 questions
//   Domain 5  Security Program Management & Oversight    20%  -> 18 questions
//                                                       Total -> 90 questions
//
// Question schema:
//   {
//     id:       unique string ("q1", ...),
//     domain:   '1'..'5' (parent domain id, matches domains.js),
//     type:     'single' | 'multi',   // multi = choose TWO
//     question: stem text,
//     options:  string[]              // answer choices in author order
//     answers:  number[]              // index/indices into options that are correct
//     explanation: 1-2 sentence rationale shown in review/practice mode
//   }

export const EXAM_PASS_XP = 200
export const PASS_PERCENT = 83 // 750/900 scaled ≈ 83%
export const EXAM_DURATION_SECONDS = 90 * 60 // 90 minutes
export const EXAM_HISTORY_LIMIT = 3

export const examQuestions = [
  // ===================================================================
  // DOMAIN 1 — General Security Concepts (11 questions)
  // ===================================================================
  {
    id: 'q1',
    domain: '1',
    type: 'single',
    question:
      'A company installs bollards in front of its data center entrance and posts visible signage warning of 24/7 surveillance. Into which control category do the warning signs BEST fit?',
    options: ['Corrective', 'Deterrent', 'Compensating', 'Detective'],
    answers: [1],
    explanation:
      'Warning signage is meant to discourage an adversary from acting, which is the defining purpose of a deterrent control.',
  },
  {
    id: 'q2',
    domain: '1',
    type: 'single',
    question:
      'An attacker alters the dollar amount of a funds-transfer message in transit so the recipient receives a different value than was sent. Which element of the CIA triad has been violated?',
    options: ['Confidentiality', 'Integrity', 'Availability', 'Authentication'],
    answers: [1],
    explanation:
      'Unauthorized modification of data in transit is a violation of integrity, which guarantees data has not been altered.',
  },
  {
    id: 'q3',
    domain: '1',
    type: 'single',
    question:
      'Two parties who have never communicated before need to establish a shared symmetric key over an untrusted network without pre-sharing any secret. Which approach solves this MOST directly?',
    options: [
      'Hashing the password with SHA-256',
      'Diffie-Hellman key exchange',
      'Encrypting the key with AES-256',
      'Encoding the key in Base64',
    ],
    answers: [1],
    explanation:
      'Diffie-Hellman lets two parties derive a shared secret over an insecure channel without ever transmitting the key itself.',
  },
  {
    id: 'q4',
    domain: '1',
    type: 'single',
    question:
      'A security analyst wants to verify that a downloaded ISO has not been altered. The vendor publishes a value the analyst can recompute locally and compare. What is this value?',
    options: [
      'A digital certificate',
      'A symmetric session key',
      'A cryptographic hash',
      'A salt',
    ],
    answers: [2],
    explanation:
      'A cryptographic hash is a one-way fingerprint of the file; recomputing it and comparing confirms integrity.',
  },
  {
    id: 'q5',
    domain: '1',
    type: 'single',
    question:
      'In a public key infrastructure, which entity is responsible for verifying the identity of a certificate requester before a certificate is issued?',
    options: [
      'Registration Authority (RA)',
      'Certificate Revocation List (CRL)',
      'Online Certificate Status Protocol (OCSP) responder',
      'Key escrow agent',
    ],
    answers: [0],
    explanation:
      'The Registration Authority validates and vouches for the identity of requesters; the CA then issues the certificate.',
  },
  {
    id: 'q6',
    domain: '1',
    type: 'single',
    question:
      'A user logs in with a password and then approves a push notification on their enrolled smartphone. Which two authentication factor categories are being combined?',
    options: [
      'Something you know and something you have',
      'Something you know and something you are',
      'Something you have and somewhere you are',
      'Something you are and something you do',
    ],
    answers: [0],
    explanation:
      'A password is "something you know" and the enrolled phone is "something you have," which together form valid MFA.',
  },
  {
    id: 'q7',
    domain: '1',
    type: 'single',
    question:
      'In a NIST 800-207 zero trust architecture, which component sits in the data path and actually permits or blocks a subject\'s access to a resource?',
    options: [
      'Policy Engine',
      'Policy Administrator',
      'Policy Enforcement Point',
      'Policy Decision Point',
    ],
    answers: [2],
    explanation:
      'The Policy Enforcement Point (PEP) is in the data plane and enforces the allow/deny decision made by the Policy Decision Point.',
  },
  {
    id: 'q8',
    domain: '1',
    type: 'single',
    question:
      'An administrator must replace an insecure protocol used to manage network devices over the command line. Which protocol provides an encrypted replacement for Telnet?',
    options: ['SNMPv2', 'SSH', 'FTP', 'HTTP'],
    answers: [1],
    explanation:
      'SSH provides an encrypted, authenticated remote command-line session, replacing the cleartext Telnet protocol.',
  },
  {
    id: 'q9',
    domain: '1',
    type: 'multi',
    question:
      'A security manager is cataloging controls by function. Which TWO of the following are DETECTIVE controls?',
    options: [
      'Security guard checking badges at the door',
      'Intrusion detection system (IDS) alert',
      'Log review identifying an after-the-fact anomaly',
      'Full-disk encryption on laptops',
      'Account lockout after failed logins',
    ],
    answers: [1, 2],
    explanation:
      'An IDS alert and after-the-fact log review both identify that an event occurred, which is the role of a detective control.',
  },
  {
    id: 'q10',
    domain: '1',
    type: 'single',
    question:
      'A contract is signed using the sender\'s private key so the recipient can confirm both the origin and that the contents are unchanged, and the sender cannot later deny signing. Which property does this provide?',
    options: ['Confidentiality', 'Non-repudiation', 'Availability', 'Obfuscation'],
    answers: [1],
    explanation:
      'A digital signature created with the private key provides non-repudiation: the signer cannot credibly deny the action.',
  },
  {
    id: 'q11',
    domain: '1',
    type: 'single',
    question:
      'A developer stores user passwords by appending a unique random value to each password before hashing it. What is the primary purpose of that random value?',
    options: [
      'To speed up the hashing operation',
      'To defeat precomputed rainbow table attacks',
      'To allow the password to be decrypted later',
      'To compress the stored credential',
    ],
    answers: [1],
    explanation:
      'A unique per-password salt ensures identical passwords hash differently, defeating precomputed rainbow-table lookups.',
  },

  // ===================================================================
  // DOMAIN 2 — Threats, Vulnerabilities & Mitigations (20 questions)
  // ===================================================================
  {
    id: 'q12',
    domain: '2',
    type: 'single',
    question:
      'Users report that their files have been encrypted and a message demands payment in cryptocurrency for a decryption key. Which malware category is this?',
    options: ['Rootkit', 'Ransomware', 'Logic bomb', 'Spyware'],
    answers: [1],
    explanation:
      'Encrypting files and demanding payment for the key is the defining behavior of ransomware.',
  },
  {
    id: 'q13',
    domain: '2',
    type: 'single',
    question:
      'A security analyst notices that an application accepts the input `\' OR \'1\'=\'1` in a login form and returns all user records. Which vulnerability is being exploited?',
    options: [
      'Cross-site scripting (XSS)',
      'SQL injection',
      'Buffer overflow',
      'Cross-site request forgery (CSRF)',
    ],
    answers: [1],
    explanation:
      'Injecting SQL syntax that always evaluates true to manipulate a backend query is SQL injection.',
  },
  {
    id: 'q14',
    domain: '2',
    type: 'single',
    question:
      'An attacker injects a malicious `<script>` tag into a forum comment so it executes in the browsers of other users who view the page. Which attack is this?',
    options: [
      'Stored cross-site scripting',
      'SQL injection',
      'Directory traversal',
      'Server-side request forgery',
    ],
    answers: [0],
    explanation:
      'Persisting a malicious script that runs in other users\' browsers when they load the page is stored (persistent) XSS.',
  },
  {
    id: 'q15',
    domain: '2',
    type: 'single',
    question:
      'A program writes more data into a fixed-length memory buffer than it can hold, overwriting adjacent memory and allowing attacker-controlled code to run. Which vulnerability class is this?',
    options: [
      'Race condition',
      'Buffer overflow',
      'Integer underflow only',
      'Memory leak',
    ],
    answers: [1],
    explanation:
      'Writing past the bounds of a fixed buffer to overwrite adjacent memory is a buffer overflow.',
  },
  {
    id: 'q16',
    domain: '2',
    type: 'single',
    question:
      'An application checks whether a file exists and then opens it as two separate steps; an attacker swaps the file between the two steps. This time-of-check to time-of-use flaw is an example of which vulnerability?',
    options: [
      'Race condition',
      'Privilege escalation',
      'Cross-site scripting',
      'Insecure deserialization',
    ],
    answers: [0],
    explanation:
      'A time-of-check/time-of-use (TOCTOU) gap exploited by changing state between operations is a race condition.',
  },
  {
    id: 'q17',
    domain: '2',
    type: 'single',
    question:
      'A nation-state group conducts a long-term, stealthy campaign to maintain persistent access and exfiltrate intellectual property over months. This threat actor is BEST described as which of the following?',
    options: [
      'Script kiddie',
      'Hacktivist',
      'Advanced persistent threat (APT)',
      'Insider with no resources',
    ],
    answers: [2],
    explanation:
      'Highly resourced, persistent, stealthy campaigns aimed at long-term access characterize an advanced persistent threat, typically nation-state backed.',
  },
  {
    id: 'q18',
    domain: '2',
    type: 'single',
    question:
      'A CVSS v3.1 base vector reads AV:N/AC:L/PR:N/UI:N with high impact across C, I, and A. Which characteristic makes this vulnerability MOST urgent to remediate?',
    options: [
      'It requires local access and user interaction',
      'It is network-exploitable with no privileges or user interaction required',
      'It only affects availability',
      'It has high attack complexity',
    ],
    answers: [1],
    explanation:
      'AV:N with PR:N and UI:N means it can be exploited remotely without credentials or user action, the most dangerous profile.',
  },
  {
    id: 'q19',
    domain: '2',
    type: 'single',
    question:
      'During triage, an analyst observes outbound connections to a known command-and-control domain at regular 60-second intervals. This regular outbound traffic is BEST classified as which type of indicator?',
    options: [
      'Indicator of compromise (beaconing)',
      'False positive',
      'Vulnerability score',
      'Acceptable use violation only',
    ],
    answers: [0],
    explanation:
      'Regular, periodic outbound connections to a C2 host is beaconing, a classic indicator of compromise.',
  },
  {
    id: 'q20',
    domain: '2',
    type: 'single',
    question:
      'An employee receives a phone call from someone claiming to be the IT help desk, who creates urgency and asks for the employee\'s MFA code "to fix an outage." Which social engineering techniques are MOST in play?',
    options: [
      'Vishing using authority and urgency',
      'Smishing using scarcity',
      'Watering hole using familiarity',
      'Tailgating using consensus',
    ],
    answers: [0],
    explanation:
      'A fraudulent voice call (vishing) impersonating IT (authority) and pressuring quick action (urgency) is the combination here.',
  },
  {
    id: 'q21',
    domain: '2',
    type: 'multi',
    question:
      'A development team must reduce the risk of SQL injection in a customer-facing web application. Which TWO controls MOST directly mitigate this vulnerability?',
    options: [
      'Parameterized queries (prepared statements)',
      'Strict server-side input validation',
      'Verbose database error messages returned to the user',
      'Increasing the session timeout',
      'Disabling the web application firewall',
    ],
    answers: [0, 1],
    explanation:
      'Parameterized queries stop input from being interpreted as SQL, and strict input validation rejects malicious payloads — both directly mitigate SQL injection.',
  },
  {
    id: 'q22',
    domain: '2',
    type: 'single',
    question:
      'An attacker registers a domain that is a single-character misspelling of a popular bank and hosts a credential-harvesting page there. What is this technique called?',
    options: ['Pharming', 'Typosquatting', 'Domain hijacking', 'DNS poisoning'],
    answers: [1],
    explanation:
      'Registering look-alike misspelled domains to catch mistyped traffic is typosquatting (URL hijacking).',
  },
  {
    id: 'q23',
    domain: '2',
    type: 'single',
    question:
      'A developer left a hardcoded administrative password in source code that was pushed to a public repository. Which vulnerability category does this represent?',
    options: [
      'Misconfiguration / hardcoded credentials',
      'Zero-day exploit',
      'Side-channel attack',
      'Jamming',
    ],
    answers: [0],
    explanation:
      'Embedding credentials in code and exposing them is a misconfiguration involving hardcoded secrets.',
  },
  {
    id: 'q24',
    domain: '2',
    type: 'single',
    question:
      'Threat intelligence reports a previously unknown vulnerability being actively exploited in the wild before any vendor patch exists. What is this called?',
    options: [
      'Legacy vulnerability',
      'Zero-day',
      'End-of-life defect',
      'Known exploited and patched CVE',
    ],
    answers: [1],
    explanation:
      'A vulnerability exploited before a fix is available is a zero-day.',
  },
  {
    id: 'q25',
    domain: '2',
    type: 'multi',
    question:
      'A security team wants to reduce the success of credential-phishing attacks against employees. Which TWO controls MOST directly mitigate this threat?',
    options: [
      'Phishing-resistant MFA (FIDO2/WebAuthn)',
      'Disabling the corporate firewall',
      'Security awareness training with simulated phishing',
      'Increasing monitor brightness',
      'Allowing password reuse across systems',
    ],
    answers: [0, 2],
    explanation:
      'Phishing-resistant MFA neutralizes stolen passwords, and awareness training reduces the click-through rate — both directly target phishing.',
  },
  {
    id: 'q26',
    domain: '2',
    type: 'single',
    question:
      'An attacker intercepts traffic between a client and server, relaying and possibly altering messages while both sides believe they communicate directly. Which attack is this?',
    options: [
      'On-path (man-in-the-middle) attack',
      'Replay attack only',
      'Birthday attack',
      'Pass-the-hash',
    ],
    answers: [0],
    explanation:
      'Sitting between two parties to relay or alter traffic while they believe they talk directly is an on-path (MITM) attack.',
  },
  {
    id: 'q27',
    domain: '2',
    type: 'single',
    question:
      'Malware hides its presence by intercepting and modifying operating system calls so that its files and processes do not appear in normal listings. Which malware type is this?',
    options: ['Adware', 'Rootkit', 'Worm', 'Keylogger'],
    answers: [1],
    explanation:
      'Subverting OS calls to hide files and processes at a privileged level is the hallmark of a rootkit.',
  },
  {
    id: 'q28',
    domain: '2',
    type: 'single',
    question:
      'A malicious insider plants code that deletes critical files automatically if their account is ever disabled. Which threat does this describe?',
    options: ['Logic bomb', 'Trojan', 'Botnet', 'Ransomware'],
    answers: [0],
    explanation:
      'Code set to execute a malicious payload when a condition is met (e.g., account disabled) is a logic bomb.',
  },
  {
    id: 'q29',
    domain: '2',
    type: 'single',
    question:
      'A web application includes user-supplied input directly in an OS shell command without sanitization, allowing an attacker to append `; rm -rf /`. Which attack class is this?',
    options: [
      'Command injection',
      'LDAP injection',
      'XML external entity (XXE)',
      'Clickjacking',
    ],
    answers: [0],
    explanation:
      'Passing untrusted input into a system shell so attacker commands run is command (OS) injection.',
  },
  {
    id: 'q30',
    domain: '2',
    type: 'single',
    question:
      'A flood of traffic from thousands of compromised hosts overwhelms a company\'s web servers and makes the site unreachable. Which attack is this?',
    options: [
      'Distributed denial-of-service (DDoS)',
      'Privilege escalation',
      'Credential stuffing',
      'Watering hole',
    ],
    answers: [0],
    explanation:
      'A coordinated flood from many compromised hosts that exhausts resources and denies service is a DDoS attack.',
  },
  {
    id: 'q31',
    domain: '2',
    type: 'single',
    question:
      'An attacker reuses username/password pairs leaked from one breached site to log in to many other unrelated services. What is this technique called?',
    options: [
      'Brute force',
      'Credential stuffing',
      'Dictionary attack',
      'Rainbow table attack',
    ],
    answers: [1],
    explanation:
      'Replaying previously breached credential pairs across other services, banking on password reuse, is credential stuffing.',
  },

  // ===================================================================
  // DOMAIN 3 — Security Architecture (16 questions)
  // ===================================================================
  {
    id: 'q32',
    domain: '3',
    type: 'single',
    question:
      'A company places its public-facing web and mail servers in a network segment isolated from the internal LAN, so a compromise there cannot directly reach internal systems. What is this segment called?',
    options: [
      'Screened subnet (DMZ)',
      'Air-gapped network',
      'Management VLAN',
      'Loopback interface',
    ],
    answers: [0],
    explanation:
      'A buffer segment for internet-facing services isolated from the internal LAN is a screened subnet, traditionally called a DMZ.',
  },
  {
    id: 'q33',
    domain: '3',
    type: 'single',
    question:
      'Remote employees need all of their internet traffic, including general web browsing, routed through the corporate VPN for inspection. Which VPN configuration achieves this?',
    options: [
      'Split tunnel',
      'Full tunnel',
      'Clientless reverse proxy only',
      'Site-to-site IPsec only',
    ],
    answers: [1],
    explanation:
      'A full-tunnel VPN routes all client traffic through the corporate gateway, enabling inspection of everything.',
  },
  {
    id: 'q34',
    domain: '3',
    type: 'single',
    question:
      'A startup uses a cloud provider that delivers ready-to-use email and CRM software accessed entirely through a browser, with no infrastructure to manage. Which cloud service model is this?',
    options: [
      'Infrastructure as a Service (IaaS)',
      'Platform as a Service (PaaS)',
      'Software as a Service (SaaS)',
      'Function as a Service only',
    ],
    answers: [2],
    explanation:
      'Consuming complete, vendor-managed applications over the web is the SaaS model.',
  },
  {
    id: 'q35',
    domain: '3',
    type: 'single',
    question:
      'In the IaaS shared responsibility model, which task is the CUSTOMER (not the cloud provider) responsible for?',
    options: [
      'Securing the physical data center',
      'Patching the guest operating system on their virtual machines',
      'Maintaining the hypervisor',
      'Replacing failed disks in the storage array',
    ],
    answers: [1],
    explanation:
      'Under IaaS, the customer manages and patches the guest OS and above; the provider handles the physical and hypervisor layers.',
  },
  {
    id: 'q36',
    domain: '3',
    type: 'single',
    question:
      'An industrial plant runs programmable logic controllers and a supervisory control system that monitors and controls physical processes. Which environment is being described?',
    options: [
      'SCADA/ICS',
      'SDN controller cluster',
      'Containerized microservices',
      'Serverless functions',
    ],
    answers: [0],
    explanation:
      'PLCs plus supervisory monitoring of physical processes describe a SCADA/Industrial Control System environment.',
  },
  {
    id: 'q37',
    domain: '3',
    type: 'single',
    question:
      'A database stores customer credit-card numbers. To ensure the data is unreadable if the storage media is stolen, which control should be applied?',
    options: [
      'Encryption of data at rest',
      'A longer session timeout',
      'Disabling audit logs',
      'Increasing the MTU',
    ],
    answers: [0],
    explanation:
      'Encrypting data at rest renders stolen media unreadable without the key, protecting confidentiality of stored card data.',
  },
  {
    id: 'q38',
    domain: '3',
    type: 'single',
    question:
      'A retailer replaces stored credit-card numbers with a non-sensitive surrogate value that has no mathematical relationship to the original, while the real numbers are held in a separate secure vault. Which technique is this?',
    options: ['Tokenization', 'Hashing', 'Steganography', 'Compression'],
    answers: [0],
    explanation:
      'Substituting a meaningless surrogate that maps back to the original only via a secure vault is tokenization.',
  },
  {
    id: 'q39',
    domain: '3',
    type: 'single',
    question:
      'A network team separates the control plane from the data plane and manages forwarding behavior centrally through a programmable controller and APIs. Which architecture is this?',
    options: [
      'Software-defined networking (SDN)',
      'Spanning Tree Protocol',
      'Traditional three-tier switching only',
      'Network address translation',
    ],
    answers: [0],
    explanation:
      'Centralized, programmable control of forwarding via a controller that separates control and data planes is SDN.',
  },
  {
    id: 'q40',
    domain: '3',
    type: 'single',
    question:
      'A zero trust architecture evaluates identity, device health, and context for every request rather than trusting any traffic based on network location. Which legacy assumption does this MOST directly replace?',
    options: [
      'That inside-the-perimeter traffic is trustworthy',
      'That encryption is unnecessary',
      'That logging should be disabled',
      'That passwords never expire',
    ],
    answers: [0],
    explanation:
      'Zero trust abandons the implicit-trust assumption that traffic originating inside the perimeter can be trusted.',
  },
  {
    id: 'q41',
    domain: '3',
    type: 'single',
    question:
      'An organization needs a secure design where a failure in one component does not cascade. Distributing workloads across multiple availability zones primarily improves which property?',
    options: ['Availability/resilience', 'Confidentiality', 'Non-repudiation', 'Obfuscation'],
    answers: [0],
    explanation:
      'Spreading workloads across zones removes single points of failure, improving availability and resilience.',
  },
  {
    id: 'q42',
    domain: '3',
    type: 'multi',
    question:
      'An architect is hardening a high-availability design. Which TWO measures BEST improve resilience against a single point of failure?',
    options: [
      'Deploying redundant load balancers in active/active',
      'Storing the only backup on the same server',
      'Using a single power supply per rack',
      'Geographically distributing replicas across regions',
      'Disabling failover to simplify operations',
    ],
    answers: [0, 3],
    explanation:
      'Redundant active/active load balancers and geographically distributed replicas both eliminate single points of failure.',
  },
  {
    id: 'q43',
    domain: '3',
    type: 'single',
    question:
      'Two corporate offices need an always-on encrypted tunnel between their networks so internal hosts communicate transparently. Which VPN type is MOST appropriate?',
    options: [
      'Site-to-site IPsec VPN',
      'Clientless SSL VPN for individual users',
      'Host-to-host SSH tunnel for one app',
      'Full-tunnel client VPN per employee',
    ],
    answers: [0],
    explanation:
      'A persistent encrypted tunnel connecting two networks is a site-to-site (gateway-to-gateway) IPsec VPN.',
  },
  {
    id: 'q44',
    domain: '3',
    type: 'single',
    question:
      'A regulation requires that customer data about EU residents remain stored within the EU. Which concept governs this requirement?',
    options: ['Data sovereignty', 'Data masking', 'Data deduplication', 'Data normalization'],
    answers: [0],
    explanation:
      'The principle that data is subject to the laws of the country where it resides — constraining where it may be stored — is data sovereignty.',
  },
  {
    id: 'q45',
    domain: '3',
    type: 'single',
    question:
      'To protect against an attacker who breaches the web tier, an architect ensures the web servers cannot initiate connections to the database tier except on the single required port. Which principle is being applied at the network layer?',
    options: [
      'Least privilege via micro-segmentation',
      'Security through obscurity',
      'Implicit allow',
      'Fail-open design',
    ],
    answers: [0],
    explanation:
      'Restricting tier-to-tier traffic to only the required flows is least privilege enforced through micro-segmentation.',
  },
  {
    id: 'q46',
    domain: '3',
    type: 'single',
    question:
      'An organization wants to detect and block malicious traffic inline, dropping packets that match known attack signatures before they reach internal hosts. Which device provides this?',
    options: [
      'Intrusion prevention system (IPS)',
      'Passive network tap',
      'Intrusion detection system (IDS) in monitor-only mode',
      'DNS resolver',
    ],
    answers: [0],
    explanation:
      'An inline device that actively drops matching malicious traffic is an intrusion prevention system; an IDS only alerts.',
  },
  {
    id: 'q47',
    domain: '3',
    type: 'single',
    question:
      'A company embeds invisible identifying marks into confidential documents so that leaked copies can be traced back to the source. Which data-protection technique is this?',
    options: ['Watermarking', 'Tokenization', 'Salting', 'Key stretching'],
    answers: [0],
    explanation:
      'Embedding traceable markers in documents to identify the source of a leak is (digital) watermarking.',
  },

  // ===================================================================
  // DOMAIN 4 — Security Operations (25 questions)
  // ===================================================================
  {
    id: 'q48',
    domain: '4',
    type: 'single',
    question:
      'A SOC tool ingests logs from servers, firewalls, and endpoints, correlates events across sources, and raises a single alert when a pattern of malicious activity is detected. Which technology is this?',
    options: [
      'SIEM',
      'A standalone syslog server',
      'A vulnerability scanner',
      'A load balancer',
    ],
    answers: [0],
    explanation:
      'Centralizing, correlating, and alerting across many log sources is the function of a SIEM.',
  },
  {
    id: 'q49',
    domain: '4',
    type: 'single',
    question:
      'During incident response, an analyst is determining which hosts are affected and how the attacker gained access. Which NIST incident response phase is this?',
    options: [
      'Preparation',
      'Detection and Analysis',
      'Containment, Eradication, and Recovery',
      'Post-Incident Activity',
    ],
    answers: [1],
    explanation:
      'Establishing scope, severity, and the entry vector is the Detection and Analysis phase of the NIST lifecycle.',
  },
  {
    id: 'q50',
    domain: '4',
    type: 'single',
    question:
      'A responder isolates an infected workstation from the network to stop the malware from spreading while leaving it powered on to preserve volatile evidence. Which phase and goal does this represent?',
    options: [
      'Eradication — removing the malware',
      'Containment — limiting spread while preserving evidence',
      'Recovery — restoring service',
      'Preparation — building the plan',
    ],
    answers: [1],
    explanation:
      'Isolating to limit spread while keeping the host running to preserve volatile data is short-term containment.',
  },
  {
    id: 'q51',
    domain: '4',
    type: 'single',
    question:
      'During a forensic investigation, an analyst must collect evidence in a specific order before it is lost. Which data source is MOST volatile and should be captured FIRST?',
    options: [
      'Data on a backup tape',
      'Contents of RAM (memory)',
      'Files on a powered-off disk',
      'Archived email in the cloud',
    ],
    answers: [1],
    explanation:
      'Per the order of volatility, RAM/CPU state is the most volatile and must be captured before it disappears on power loss.',
  },
  {
    id: 'q52',
    domain: '4',
    type: 'single',
    question:
      'To ensure digital evidence is admissible, investigators document every person who handled it, when, and why, from collection to court. What is this documentation called?',
    options: [
      'Chain of custody',
      'Service-level agreement',
      'Acceptable use policy',
      'Memorandum of understanding',
    ],
    answers: [0],
    explanation:
      'The unbroken, documented record of who handled evidence and when is the chain of custody.',
  },
  {
    id: 'q53',
    domain: '4',
    type: 'single',
    question:
      'A company implements a process where access rights are granted only for the duration a task requires and are automatically revoked afterward. Which IAM concept is this?',
    options: [
      'Just-in-time (JIT) access',
      'Permanent standing privilege',
      'Shared administrator accounts',
      'Single sign-on',
    ],
    answers: [0],
    explanation:
      'Granting elevated access only when needed and revoking it after is just-in-time (JIT) provisioning.',
  },
  {
    id: 'q54',
    domain: '4',
    type: 'single',
    question:
      'An organization wants users to authenticate once and then access multiple applications without re-entering credentials. Which technology provides this?',
    options: [
      'Single sign-on (SSO)',
      'Separation of duties',
      'Mandatory access control',
      'Network access control',
    ],
    answers: [0],
    explanation:
      'Authenticating once to access many applications is single sign-on (SSO).',
  },
  {
    id: 'q55',
    domain: '4',
    type: 'single',
    question:
      'A security tool on endpoints continuously records process, file, and network activity and can automatically respond to detected threats such as isolating the host. Which technology is this?',
    options: [
      'Endpoint detection and response (EDR)',
      'A traditional signature-only antivirus',
      'A network firewall',
      'A password manager',
    ],
    answers: [0],
    explanation:
      'Continuous endpoint telemetry with automated detection and response capability is EDR.',
  },
  {
    id: 'q56',
    domain: '4',
    type: 'multi',
    question:
      'A security operations team wants to reduce the organization\'s exposure to known vulnerabilities. Which TWO activities MOST directly support that goal?',
    options: [
      'Timely patch management of affected systems',
      'Regular authenticated vulnerability scanning',
      'Disabling centralized logging',
      'Sharing administrator passwords across teams',
      'Removing multifactor authentication',
    ],
    answers: [0, 1],
    explanation:
      'Patching closes known holes and recurring vulnerability scanning finds them; together they drive down exposure to known CVEs.',
  },
  {
    id: 'q57',
    domain: '4',
    type: 'single',
    question:
      'A threat intelligence feed shares machine-readable indicators such as malicious IPs and file hashes using a standardized format and transport. Which pair of standards is commonly used?',
    options: [
      'STIX and TAXII',
      'SAML and SCIM',
      'OAuth and OpenID',
      'SNMP and NetFlow',
    ],
    answers: [0],
    explanation:
      'STIX structures threat indicators and TAXII transports them, the common standards for sharing threat intelligence.',
  },
  {
    id: 'q58',
    domain: '4',
    type: 'single',
    question:
      'A vulnerability management program rescans systems after remediation to confirm a previously reported finding no longer appears. What is this step called?',
    options: [
      'Validation of remediation (rescan)',
      'Initial discovery',
      'Risk acceptance',
      'False-positive suppression only',
    ],
    answers: [0],
    explanation:
      'Rescanning to confirm a fix actually removed the finding is remediation validation.',
  },
  {
    id: 'q59',
    domain: '4',
    type: 'multi',
    question:
      'A SOC analyst is triaging a suspected brute-force attack. Which TWO log fields are MOST useful to confirm and scope it?',
    options: [
      'Source IP address of the authentication attempts',
      'Monitor refresh rate',
      'Count of failed logins per time window',
      'Desktop wallpaper hash',
      'Printer toner level',
    ],
    answers: [0, 2],
    explanation:
      'The source IP and the rate of failed logins over time are exactly what distinguishes brute force from normal activity.',
  },
  {
    id: 'q60',
    domain: '4',
    type: 'single',
    question:
      'A company wants to verify that only devices meeting security posture requirements (patched, EDR running) can connect to the corporate network. Which technology enforces this at connection time?',
    options: [
      'Network access control (NAC)',
      'A reverse proxy',
      'A CASB only',
      'A jump server',
    ],
    answers: [0],
    explanation:
      'Assessing device posture and permitting or quarantining at network connection is the role of NAC.',
  },
  {
    id: 'q61',
    domain: '4',
    type: 'single',
    question:
      'After an incident is fully resolved, the team meets to document what happened, what worked, and what to improve. Which NIST phase is this?',
    options: [
      'Post-Incident Activity (lessons learned)',
      'Detection and Analysis',
      'Preparation',
      'Containment',
    ],
    answers: [0],
    explanation:
      'The lessons-learned review after resolution is the Post-Incident Activity phase.',
  },
  {
    id: 'q62',
    domain: '4',
    type: 'single',
    question:
      'A security engineer wants administrators to connect to sensitive servers only through a single hardened, heavily logged host. What is this host called?',
    options: [
      'Jump server (bastion host)',
      'Honeypot',
      'Edge router',
      'DNS sinkhole',
    ],
    answers: [0],
    explanation:
      'A hardened intermediary that admins must pass through to reach sensitive systems is a jump server/bastion host.',
  },
  {
    id: 'q63',
    domain: '4',
    type: 'single',
    question:
      'An analyst proactively searches the environment for signs of an attacker that automated alerts have not flagged, forming and testing hypotheses against collected telemetry. This activity is BEST described as which of the following?',
    options: [
      'Threat hunting',
      'Patch management',
      'Disaster recovery testing',
      'Capacity planning',
    ],
    answers: [0],
    explanation:
      'Hypothesis-driven proactive searching for undetected threats is threat hunting.',
  },
  {
    id: 'q64',
    domain: '4',
    type: 'single',
    question:
      'An automated playbook in a SOAR platform enriches an alert with threat intel and auto-blocks the malicious IP without analyst intervention. Which benefit does SOAR PRIMARILY provide here?',
    options: [
      'Orchestration and automated response to reduce analyst workload',
      'Physical destruction of media',
      'Encryption key escrow',
      'Cable management',
    ],
    answers: [0],
    explanation:
      'SOAR provides orchestration and automation of response actions, reducing manual analyst effort and response time.',
  },
  {
    id: 'q65',
    domain: '4',
    type: 'single',
    question:
      'A SIEM rule fires an alert every time a backup job completes successfully, burying real alerts. What is this excessive noise called, and what is the fix?',
    options: [
      'False positives — tune the rule to reduce them',
      'True positives — escalate each one',
      'Zero-days — patch immediately',
      'Chain of custody breaks — re-collect evidence',
    ],
    answers: [0],
    explanation:
      'Alerts on benign activity are false positives; tuning the detection rule reduces alert fatigue.',
  },
  {
    id: 'q66',
    domain: '4',
    type: 'single',
    question:
      'To centrally provision and de-provision user accounts across many SaaS applications automatically when HR adds or removes an employee, which standard is commonly used?',
    options: [
      'SCIM',
      'ICMP',
      'SMTP',
      'NTP',
    ],
    answers: [0],
    explanation:
      'SCIM (System for Cross-domain Identity Management) automates account provisioning/de-provisioning across applications.',
  },
  {
    id: 'q67',
    domain: '4',
    type: 'single',
    question:
      'An organization configures systems to send logs to a centralized, write-once log store that administrators cannot alter. What is the PRIMARY security benefit?',
    options: [
      'Preserving log integrity for investigations',
      'Reducing network bandwidth',
      'Eliminating the need for backups',
      'Increasing CPU performance',
    ],
    answers: [0],
    explanation:
      'A tamper-resistant, write-once central log store preserves log integrity so evidence cannot be altered by an attacker or insider.',
  },
  {
    id: 'q68',
    domain: '4',
    type: 'multi',
    question:
      'A company uses mobile device management (MDM) to protect data on corporate phones that may be lost or stolen. Which TWO MDM capabilities MOST directly protect the confidentiality of data on a missing device?',
    options: [
      'Remote wipe of the device',
      'Enforced full-device encryption',
      'Increasing screen brightness',
      'Disabling the device passcode requirement',
      'Allowing unrestricted app sideloading',
    ],
    answers: [0, 1],
    explanation:
      'Remote wipe removes data from a lost device and enforced encryption keeps stored data unreadable without the key — both protect confidentiality.',
  },
  {
    id: 'q69',
    domain: '4',
    type: 'single',
    question:
      'A forensic analyst needs to prove that a copied disk image is identical to the original seized drive. Which technique provides this proof?',
    options: [
      'Comparing cryptographic hashes of the source and the image',
      'Comparing file creation dates only',
      'Re-imaging until sizes match',
      'Renaming the image file',
    ],
    answers: [0],
    explanation:
      'Matching hashes of the original and the forensic image proves bit-for-bit integrity of the copy.',
  },
  {
    id: 'q70',
    domain: '4',
    type: 'single',
    question:
      'A security team enforces that no single administrator can both request and approve a privileged change. Which principle does this implement?',
    options: [
      'Separation of duties',
      'Implicit trust',
      'Least functionality',
      'Single sign-on',
    ],
    answers: [0],
    explanation:
      'Requiring different people to request and approve a sensitive action is separation of duties.',
  },
  {
    id: 'q71',
    domain: '4',
    type: 'single',
    question:
      'An analyst correlates a failed-login spike, a successful login from a new country, and a mass file-download within minutes into one storyline. Which SIEM capability made this possible?',
    options: [
      'Event correlation across multiple sources',
      'Raw packet capture only',
      'Disk defragmentation',
      'Static code analysis',
    ],
    answers: [0],
    explanation:
      'Linking related events from different sources into a single narrative is event correlation, a core SIEM capability.',
  },
  {
    id: 'q72',
    domain: '4',
    type: 'single',
    question:
      'During recovery from a ransomware incident, the team restores systems from backups taken before the infection and validates integrity before reconnecting. Which decision gate should occur before reconnecting to production?',
    options: [
      'A go/no-go validation that systems are clean and restored correctly',
      'Immediately paying the ransom',
      'Disabling all logging',
      'Skipping testing to save time',
    ],
    answers: [0],
    explanation:
      'A go/no-go validation confirming systems are clean and correctly restored should gate reconnection to production.',
  },

  // ===================================================================
  // DOMAIN 5 — Security Program Management & Oversight (18 questions)
  // ===================================================================
  {
    id: 'q73',
    domain: '5',
    type: 'single',
    question:
      'A risk analyst multiplies the probability of an event by the magnitude of its consequence to rank risks. Which formula is being applied?',
    options: [
      'Risk = Likelihood × Impact',
      'Risk = Threat − Vulnerability',
      'Risk = Asset Value + Exposure Factor',
      'Risk = Uptime ÷ Downtime',
    ],
    answers: [0],
    explanation:
      'Qualitative risk scoring commonly uses Risk = Likelihood × Impact to rank risks on a single scale.',
  },
  {
    id: 'q74',
    domain: '5',
    type: 'single',
    question:
      'After applying a control, an organization documents the level of risk that still remains and the executive who formally accepts it. What is this remaining risk called?',
    options: ['Residual risk', 'Inherent risk', 'Transferred risk', 'Total risk avoidance'],
    answers: [0],
    explanation:
      'The risk left over after controls are applied is residual risk, which must be accepted against the risk appetite.',
  },
  {
    id: 'q75',
    domain: '5',
    type: 'single',
    question:
      'A company buys cyber-insurance to cover potential losses from a data breach rather than reducing the likelihood itself. Which risk treatment is this?',
    options: ['Risk transfer', 'Risk avoidance', 'Risk acceptance', 'Risk mitigation'],
    answers: [0],
    explanation:
      'Shifting the financial impact of a risk to a third party such as an insurer is risk transference.',
  },
  {
    id: 'q76',
    domain: '5',
    type: 'single',
    question:
      'A business continuity plan specifies that a critical system must be restored within 4 hours of an outage. Which metric does the "4 hours" represent?',
    options: [
      'Recovery Time Objective (RTO)',
      'Recovery Point Objective (RPO)',
      'Mean Time Between Failures (MTBF)',
      'Maximum Tolerable Downtime only',
    ],
    answers: [0],
    explanation:
      'The maximum acceptable time to restore a system after an outage is the Recovery Time Objective (RTO).',
  },
  {
    id: 'q77',
    domain: '5',
    type: 'single',
    question:
      'A disaster recovery plan states that the business can tolerate losing at most 15 minutes of data. Which metric does this define?',
    options: [
      'Recovery Point Objective (RPO)',
      'Recovery Time Objective (RTO)',
      'Mean Time To Repair (MTTR)',
      'Annualized Loss Expectancy (ALE)',
    ],
    answers: [0],
    explanation:
      'The maximum acceptable amount of data loss measured in time is the Recovery Point Objective (RPO).',
  },
  {
    id: 'q78',
    domain: '5',
    type: 'single',
    question:
      'A healthcare provider must protect the confidentiality of patient health information under U.S. law. Which regulation applies?',
    options: ['HIPAA', 'PCI DSS', 'GDPR', 'SOX'],
    answers: [0],
    explanation:
      'HIPAA governs the protection of protected health information (PHI) for U.S. healthcare entities.',
  },
  {
    id: 'q79',
    domain: '5',
    type: 'single',
    question:
      'A merchant that stores and processes cardholder data must comply with which industry standard?',
    options: ['PCI DSS', 'HIPAA', 'FERPA', 'GLBA'],
    answers: [0],
    explanation:
      'PCI DSS is the contractual standard governing the handling of payment card data.',
  },
  {
    id: 'q80',
    domain: '5',
    type: 'single',
    question:
      'A SaaS provider undergoes an independent audit of its controls over security, availability, and confidentiality and shares the report with customers. Which attestation is this MOST likely?',
    options: ['SOC 2', 'CVE', 'CVSS', 'ISO 9001 only'],
    answers: [0],
    explanation:
      'A SOC 2 report attests to a service organization\'s controls over security, availability, processing integrity, confidentiality, and privacy.',
  },
  {
    id: 'q81',
    domain: '5',
    type: 'single',
    question:
      'Under the GDPR, which role determines the purposes and means of processing personal data and bears primary accountability?',
    options: ['Data controller', 'Data processor', 'Data subject', 'Supervisory authority'],
    answers: [0],
    explanation:
      'The data controller decides why and how personal data is processed and holds primary accountability under GDPR.',
  },
  {
    id: 'q82',
    domain: '5',
    type: 'single',
    question:
      'An organization classifies a document as "Confidential — internal only." Which document type in the governance hierarchy states the mandatory minimum password length of 14 characters?',
    options: ['Standard', 'Policy', 'Guideline', 'Procedure'],
    answers: [0],
    explanation:
      'A standard is the mandatory, specific rule (e.g., 14-character passwords) that supports a higher-level policy.',
  },
  {
    id: 'q83',
    domain: '5',
    type: 'single',
    question:
      'Before granting a new SaaS vendor access to customer data, a company reviews the vendor\'s security posture, requests a SOC 2 report, and adds security requirements to the contract. Which program does this represent?',
    options: [
      'Third-party / supply chain risk management',
      'Change management',
      'Patch management',
      'Capacity planning',
    ],
    answers: [0],
    explanation:
      'Assessing and contractually managing a vendor\'s security before granting access is third-party (supply chain) risk management.',
  },
  {
    id: 'q84',
    domain: '5',
    type: 'multi',
    question:
      'An organization is formalizing its data classification scheme. Which TWO are valid reasons to classify data?',
    options: [
      'To apply protection controls proportional to sensitivity',
      'To meet legal and regulatory handling requirements',
      'To increase the size of every file',
      'To eliminate the need for any encryption',
      'To make all data public by default',
    ],
    answers: [0, 1],
    explanation:
      'Classification scales protection to sensitivity and supports legal/regulatory handling obligations.',
  },
  {
    id: 'q85',
    domain: '5',
    type: 'single',
    question:
      'A contract between two organizations that defines the expected service levels, including uptime guarantees and penalties, is BEST described as which agreement?',
    options: [
      'Service-level agreement (SLA)',
      'Memorandum of understanding (MOU)',
      'Non-disclosure agreement (NDA)',
      'Business partner agreement (BPA)',
    ],
    answers: [0],
    explanation:
      'An SLA specifies measurable service levels such as uptime and the consequences of missing them.',
  },
  {
    id: 'q86',
    domain: '5',
    type: 'single',
    question:
      'A privacy program lets individuals request that an organization delete their personal data when there is no lawful reason to retain it. Which GDPR right is this?',
    options: [
      'Right to erasure (right to be forgotten)',
      'Right to portability only',
      'Right of access only',
      'Right to rectification only',
    ],
    answers: [0],
    explanation:
      'The right to have personal data deleted when retention is no longer justified is the GDPR right to erasure.',
  },
  {
    id: 'q87',
    domain: '5',
    type: 'single',
    question:
      'A security awareness program is evaluated by tracking the percentage of employees who click simulated phishing emails over time. A DECREASING click rate primarily indicates which outcome?',
    options: [
      'Improved user behavior / program effectiveness',
      'Increased malware infections',
      'Higher network latency',
      'Reduced backup frequency',
    ],
    answers: [0],
    explanation:
      'A falling phishing click rate is the headline metric showing the awareness program is changing user behavior.',
  },
  {
    id: 'q88',
    domain: '5',
    type: 'single',
    question:
      'An organization adopts the NIST Cybersecurity Framework to organize its controls. Which statement BEST characterizes the CSF?',
    options: [
      'A voluntary framework, not a law, used to structure and communicate cybersecurity activities',
      'A mandatory regulation with legal penalties for non-compliance',
      'A specific encryption algorithm',
      'A vulnerability scoring system',
    ],
    answers: [0],
    explanation:
      'The NIST CSF is a voluntary framework for organizing and communicating cybersecurity risk management, not a law.',
  },
  {
    id: 'q89',
    domain: '5',
    type: 'single',
    question:
      'A company performs a business impact analysis (BIA). What is the PRIMARY output of a BIA?',
    options: [
      'Identification of critical functions and the impact of their disruption over time',
      'A list of open CVEs',
      'A network diagram of all switches',
      'The source code of critical applications',
    ],
    answers: [0],
    explanation:
      'A BIA identifies critical business functions and quantifies the impact of their disruption, informing RTO/RPO and priorities.',
  },
  {
    id: 'q90',
    domain: '5',
    type: 'single',
    question:
      'An organization requires employees to take their full annual leave so a second person must perform their duties, increasing the chance of detecting fraud. Which control is this?',
    options: [
      'Mandatory vacation',
      'Least privilege',
      'Air gap',
      'Geofencing',
    ],
    answers: [0],
    explanation:
      'Mandatory vacation forces another person into the role, exposing concealed fraudulent activity — a detective administrative control.',
  },
]

// ---- Derived helpers ---------------------------------------------------

// Per-domain target counts, used to validate distribution and label results.
export const EXAM_DOMAIN_COUNTS = examQuestions.reduce((acc, q) => {
  acc[q.domain] = (acc[q.domain] || 0) + 1
  return acc
}, {})

export const TOTAL_EXAM_QUESTIONS = examQuestions.length // 90

// Fisher-Yates shuffle that returns a new array (does not mutate input).
export function shuffle(array) {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Compare a user's selected option-index array against the correct answers.
// Order-insensitive; supports both single and multi-select questions.
export function isAnswerCorrect(question, selected) {
  if (!Array.isArray(selected)) return false
  const want = [...question.answers].sort()
  const got = [...selected].sort()
  if (want.length !== got.length) return false
  return want.every((v, i) => v === got[i])
}
