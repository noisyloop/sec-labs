// Content model for sec-labs.
//
// Structure:
//   domains[] -> { id, code, title, weight, description, accentNote, exercises[] }
//   exercise   -> {
//     id, code, title, concept[], directive{ intro, steps[], snippet? },
//     resources[]{ label, url }, prompts[], examTieIn{ code, text }, xp
//   }
//
// Exercise ids are globally unique strings ("1.1", "2.3", ...). Within a
// domain, exercises unlock sequentially: an exercise is unlocked only when the
// previous one in the same domain is complete (the first is always unlocked).

export const XP_PER_EXERCISE = 50

export const domains = [
  {
    id: '1',
    code: 'Domain 1',
    title: 'General Security Concepts',
    weight: 12,
    description:
      'The foundational vocabulary of the exam: the CIA triad, the AAA framework, change management, and the cryptographic primitives every other domain leans on. Get fluent here and the rest of SY0-701 stops feeling like memorization.',
    exercises: [
      {
        id: '1.1',
        code: 'Exercise 1.1',
        title: 'CIA Triad Lab',
        xp: XP_PER_EXERCISE,
        concept: [
          'Confidentiality, Integrity, and Availability are the three properties every security control ultimately serves. Confidentiality keeps data secret from those who should not see it. Integrity guarantees data has not been altered — accidentally or maliciously — since it was trusted. Availability ensures the people who are entitled to the data can actually reach it when they need it.',
          'These three pull against each other. Encrypting a file raises confidentiality, but if you lose the key, you have just destroyed availability for yourself. A read-only backup raises integrity and availability but does nothing for confidentiality. Real security is the deliberate trade between the three for a given asset.',
          'In this lab you will physically act out each property on a single file so the abstract model becomes muscle memory. You will protect confidentiality with encryption, attack integrity with a hex editor, and remove availability by deleting access.',
        ],
        directive: {
          intro:
            'You only need a terminal with GPG installed (preinstalled on most Linux/macOS; on Windows use Gpg4win). Work in a throwaway directory.',
          steps: [
            'Create a plaintext file: echo "Patient record: J. Doe, A+ blood type" > record.txt',
            'Encrypt it symmetrically with GPG. You will be prompted for a passphrase — this protects CONFIDENTIALITY.',
            'Open the original record.txt in a hex editor (ghex, hexedit, or VS Code Hex Editor) and flip a single byte, then save. You have just violated INTEGRITY.',
            'Make a SHA-256 hash of the file before and after your edit and compare them — proof the integrity check fails.',
            'Now remove your own access: chmod 000 record.txt (or move it to an encrypted volume you then unmount). You have removed AVAILABILITY.',
            'Write three short sentences mapping each action to its CIA property, in your own words.',
          ],
          snippet:
            '# Encrypt (Confidentiality)\ngpg --symmetric --cipher-algo AES256 record.txt   # produces record.txt.gpg\n\n# Integrity check\nsha256sum record.txt          # note the hash, edit a byte, then:\nsha256sum record.txt          # hash changes -> integrity violated\n\n# Remove Availability\nchmod 000 record.txt          # you can no longer read it',
        },
        resources: [
          {
            label: 'Professor Messer — CIA Triad (SY0-701)',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
          {
            label: 'GnuPG — Using symmetric encryption',
            url: 'https://www.gnupg.org/gph/en/manual/x110.html',
          },
          {
            label: 'NIST SP 800-175B — Cryptographic standards',
            url: 'https://csrc.nist.gov/pubs/sp/800/175/b/r1/final',
          },
        ],
        prompts: [
          'What happens to availability when encryption is applied — and when does it become a self-inflicted denial of service?',
          'How does integrity differ from confidentiality? Give one control that provides integrity but not confidentiality.',
          'Which SY0-701 objective does this exercise map to, and what other concepts live under it?',
        ],
        examTieIn: {
          code: '1.2',
          text: 'Summarize fundamental security concepts.',
        },
      },
      {
        id: '1.2',
        code: 'Exercise 1.2',
        title: 'AAA Framework Simulation',
        xp: XP_PER_EXERCISE,
        concept: [
          'AAA stands for Authentication, Authorization, and Accounting — three distinct stages that are easy to blur together. Authentication answers "who are you?" by validating credentials. Authorization answers "what are you allowed to do?" once identity is established. Accounting answers "what did you actually do?" by recording activity for audit and billing.',
          'The order matters and the separation matters. A system can authenticate you perfectly and still deny every action because authorization says no. Accounting is the piece students forget — it is the log trail that turns an incident into a reconstructable story and underpins non-repudiation.',
          'FreeRADIUS is the classic open-source AAA server. By standing one up and watching a failed login land in the log, you will see all three A’s in a single request/response cycle.',
        ],
        directive: {
          intro:
            'Use a local Ubuntu VM or a Docker container so you can throw it away afterward. You will install FreeRADIUS, define two users, and read the auth log.',
          steps: [
            'Launch a container: docker run -it --name radius ubuntu:22.04 bash (or use a fresh Ubuntu VM).',
            'Install the server: apt update && apt install -y freeradius freeradius-utils.',
            'Define two users with different privilege attributes in /etc/freeradius/3.0/users — e.g. an "operator" and a read-only "viewer".',
            'Start the server in debug mode so you can watch requests live: freeradius -X.',
            'From another shell, test a GOOD login with radtest, then a BAD password, and watch both hit the debug output.',
            'Enable/inspect accounting in /var/log/freeradius/radius.log and identify the line that records the failed attempt.',
          ],
          snippet:
            '# /etc/freeradius/3.0/users\noperator  Cleartext-Password := "Op-Str0ng!"\n        Reply-Message := "Welcome operator"\nviewer    Cleartext-Password := "View-0nly!"\n\n# Test from a second shell\nradtest operator Op-Str0ng! 127.0.0.1 0 testing123   # Access-Accept\nradtest operator wrongpass  127.0.0.1 0 testing123   # Access-Reject',
        },
        resources: [
          {
            label: 'FreeRADIUS — Getting started',
            url: 'https://wiki.freeradius.org/guide/Getting-Started',
          },
          {
            label: 'Professor Messer — Authentication, Authorization, and Accounting',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
          {
            label: 'Cloudflare — What is AAA security?',
            url: 'https://www.cloudflare.com/learning/access-management/what-is-aaa/',
          },
        ],
        prompts: [
          'What is the precise difference between authentication and authorization, and which one happens first?',
          'Where does accounting occur in this flow, and how does it support non-repudiation?',
          'Name a real-world AAA protocol and one place you would deploy it (RADIUS, TACACS+, Diameter…).',
        ],
        examTieIn: {
          code: '1.2',
          text: 'Summarize fundamental security concepts.',
        },
      },
      {
        id: '1.3',
        code: 'Exercise 1.3',
        title: 'Cryptography Fundamentals',
        xp: XP_PER_EXERCISE,
        concept: [
          'Symmetric encryption uses one shared secret for both encryption and decryption — fast, but the key-distribution problem is brutal. Asymmetric encryption uses a mathematically linked keypair: what the public key locks, only the private key opens. That asymmetry solves key distribution and enables digital signatures.',
          'Hashing is a third thing entirely, and conflating it with encryption is the most common beginner error. A hash is a one-way fingerprint — there is no key and no "un-hash." Its job is integrity and verification, not secrecy. A good hash exhibits the avalanche effect: change one bit of input and roughly half the output bits flip unpredictably.',
          'In this lab you will run all three primitives with OpenSSL: generate an RSA keypair, encrypt and decrypt a message across the keypair, then watch SHA-256 detonate when you alter a single byte.',
        ],
        directive: {
          intro:
            'OpenSSL ships on virtually every Linux/macOS box and is available for Windows. No VM required.',
          steps: [
            'Generate a 2048-bit RSA private key, then derive the public key from it.',
            'Write a short message to msg.txt and encrypt it with the PUBLIC key.',
            'Decrypt the ciphertext with the PRIVATE key and confirm it matches the original — proving the asymmetry.',
            'Hash a file with SHA-256 and record the digest.',
            'Change exactly one byte of the file, re-hash, and compare. Observe how wildly different the digest is (the avalanche effect).',
            'Note in writing why you could NOT have decrypted with the public key.',
          ],
          snippet:
            '# Asymmetric (RSA)\nopenssl genrsa -out priv.pem 2048\nopenssl rsa -in priv.pem -pubout -out pub.pem\necho "meet at the NOC at 0300" > msg.txt\nopenssl pkeyutl -encrypt -pubin -inkey pub.pem -in msg.txt -out msg.enc\nopenssl pkeyutl -decrypt -inkey priv.pem -in msg.enc        # original text\n\n# Hashing / avalanche effect\nsha256sum msg.txt        # note digest, change one byte, then re-run\nsha256sum msg.txt        # completely different digest',
        },
        resources: [
          {
            label: 'OpenSSL — Command documentation',
            url: 'https://docs.openssl.org/master/man1/',
          },
          {
            label: 'Professor Messer — Cryptography concepts',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
          {
            label: 'NIST — Hash functions',
            url: 'https://csrc.nist.gov/projects/hash-functions',
          },
        ],
        prompts: [
          'Why can’t you decrypt with the same (public) key you encrypted with in an asymmetric scheme?',
          'What makes hashing fundamentally different from encryption, and why is "decrypting a hash" a meaningless phrase?',
          'Where does SY0-701 test this, and what is the difference between AES, RSA, and SHA-256 in that context?',
        ],
        examTieIn: {
          code: '1.4',
          text: 'Explain the importance of using appropriate cryptographic solutions.',
        },
      },
    ],
  },
  {
    id: '2',
    code: 'Domain 2',
    title: 'Threats, Vulnerabilities & Mitigations',
    weight: 22,
    description:
      'The biggest scored chunk after operations. Malware families, the threat actors who deploy them, the vulnerabilities they exploit, and the mitigations that close the gap. This is where you learn to read indicators of compromise like a language.',
    exercises: [
      {
        id: '2.1',
        code: 'Exercise 2.1',
        title: 'Malware Analysis (Static)',
        xp: XP_PER_EXERCISE,
        concept: [
          'Static analysis means examining a file without executing it — safe, fast, and the first move in any triage. Even without running code you can extract enormous signal: embedded strings, suspicious imports, packed sections, hard-coded URLs and IP addresses. These are indicators of compromise (IOCs) that feed detection rules.',
          'You will never analyze live malware on your daily driver. The industry-safe stand-in is the EICAR test string — a harmless 68-byte file every antivirus is contractually obligated to flag. It lets you exercise the entire detection workflow with zero risk. MalwareBazaar and VirusTotal then show how the wider community classifies samples.',
          'The skill being built is reading raw bytes for intent: a binary that contains "cmd.exe /c", a base64 blob, and a Pastebin URL is telling you a story before it ever runs.',
        ],
        directive: {
          intro:
            'Stay safe: use the EICAR test string, not real malware. The point is the workflow, not the payload.',
          steps: [
            'Create the EICAR test file (it will trip your AV — that is the expected, safe behavior).',
            'Upload the file’s HASH (not necessarily the file) to VirusTotal and read how engines classify it.',
            'Run strings against a benign sample binary (any system utility works) and scan for URLs, IPs, registry keys, and command fragments.',
            'On MalwareBazaar, look up a real sample’s page (read-only) and note the IOC fields: SHA-256, signature, tags, YARA matches.',
            'Write up: what category would this be, and what three IOCs would you turn into a detection?',
          ],
          snippet:
            '# EICAR test string (harmless AV trigger)\nprintf \'X5O!P%%@AP[4\\\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*\' > eicar.com\n\n# Static triage\nstrings -n 6 /bin/ls | head -40        # try on a real binary\nsha256sum eicar.com                     # paste the HASH into VirusTotal',
        },
        resources: [
          {
            label: 'MalwareBazaar (abuse.ch)',
            url: 'https://bazaar.abuse.ch/',
          },
          { label: 'VirusTotal', url: 'https://www.virustotal.com/' },
          {
            label: 'EICAR test file — official page',
            url: 'https://www.eicar.org/download-anti-malware-testfile/',
          },
          {
            label: 'Professor Messer — Malware & indicators',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'What type of malware would the indicators you found suggest, and how did you reach that conclusion?',
          'Which specific IOCs did you identify, and how would you operationalize them into a detection rule?',
          'How would you detect this class of threat across a corporate environment (EDR, SIEM, network)?',
        ],
        examTieIn: {
          code: '2.4',
          text: 'Given a scenario, analyze indicators of malicious activity.',
        },
      },
      {
        id: '2.2',
        code: 'Exercise 2.2',
        title: 'Vulnerability Scanning',
        xp: XP_PER_EXERCISE,
        concept: [
          'A vulnerability is a weakness; an exploit is the code or technique that weaponizes it; a threat is the actor who would. Vulnerability management is the discipline of finding weaknesses before the threat does, prioritizing them, and driving them down. Scanners are how you find them at scale.',
          'CVEs give every known vulnerability a unique identifier; CVSS gives it a severity score from 0–10 based on exploitability and impact. A scanner like OpenVAS or Nessus enumerates services, fingerprints versions, and matches them against a CVE database, producing a prioritized report. Nmap is the lighter-weight reconnaissance step that maps the attack surface first.',
          'Metasploitable 2 is a deliberately vulnerable VM built for exactly this practice. Scanning it on a host-only network is the safe, legal way to see real critical-severity findings without touching anyone else’s systems.',
        ],
        directive: {
          intro:
            'Critical: use a HOST-ONLY adapter so the vulnerable VM is never exposed to your LAN or the internet. Never scan systems you do not own.',
          steps: [
            'Import Metasploitable 2 into VirtualBox and set its network adapter to Host-only.',
            'From your host (or a Kali VM on the same host-only net), run an Nmap service/version scan to map open ports.',
            'Install OpenVAS (Greenbone Community Edition) or Nessus Essentials and run a full scan against the Metasploitable IP.',
            'Export the report and sort findings by CVSS score.',
            'Take the highest-CVSS finding, look the CVE up in the NIST NVD, and read its vector string and remediation.',
            'Document one mitigation Sec+ expects for that vulnerability class (patching, segmentation, disabling the service…).',
          ],
          snippet:
            '# Map the attack surface first\nnmap -sV -sC -p- 192.168.56.101\n\n# Then run an authenticated/unauthenticated scan with OpenVAS or Nessus\n# Sort the exported report by CVSS, then look the top CVE up at:\n# https://nvd.nist.gov/vuln/search',
        },
        resources: [
          {
            label: 'Metasploitable 2 (SourceForge)',
            url: 'https://sourceforge.net/projects/metasploitable/',
          },
          { label: 'NIST NVD — CVE search', url: 'https://nvd.nist.gov/' },
          {
            label: 'Greenbone / OpenVAS Community Edition',
            url: 'https://greenbone.github.io/docs/latest/',
          },
          {
            label: 'Nessus Essentials (free tier)',
            url: 'https://www.tenable.com/products/nessus/nessus-essentials',
          },
        ],
        prompts: [
          'What is the difference between a vulnerability and an exploit, and where does a "threat" fit?',
          'What does a CVSS base score actually measure, and what does a 9.8 tell you that a 5.0 does not?',
          'What mitigation does SY0-701 expect you to cite for the highest-severity finding you discovered?',
        ],
        examTieIn: {
          code: '2.5',
          text: 'Explain the purpose of mitigation techniques used to secure the enterprise.',
        },
      },
      {
        id: '2.3',
        code: 'Exercise 2.3',
        title: 'Social Engineering Awareness',
        xp: XP_PER_EXERCISE,
        concept: [
          'The most patched network in the world still has humans on it, and humans run on heuristics that attackers exploit deliberately: authority, urgency, scarcity, familiarity, and the simple desire to be helpful. Phishing (email), vishing (voice), smishing (SMS), and pretexting (a fabricated backstory) are all delivery vehicles for the same psychological levers.',
          'Spear phishing narrows the aim — a lure crafted for one person using details that make it credible. Whaling targets executives. Business email compromise impersonates a trusted internal voice. The defense is never purely technical; it is training, reporting culture, and process controls like out-of-band verification of payment changes.',
          'GoPhish lets you run an ethical, self-contained phishing simulation against an address you control, so you can see the full chain — lure, landing page, captured click — the way a security awareness team does internally.',
        ],
        directive: {
          intro:
            'Ethics first: only ever target email addresses and people that you personally control or have written permission to test. GoPhish is for authorized awareness testing, never unsolicited targeting.',
          steps: [
            'Install GoPhish locally and log into its admin console.',
            'Create a sending profile pointed at a test mailbox you own (or a local mail catcher like MailHog).',
            'Build an email template and a landing page that together form a believable pretext (e.g. a fake "password expiring" notice).',
            'Define a target group containing only your own test address.',
            'Launch the campaign, click your own lure, and watch GoPhish record the event.',
            'Document the full attack chain and the exact psychological principle each stage exploited.',
          ],
          snippet:
            '# Run GoPhish locally (binary release)\n./gophish\n# Admin UI:  https://127.0.0.1:3333\n# Phishing server (lures/landing): http://127.0.0.1:80\n# Tip: pair with MailHog (docker run -p 8025:8025 -p 1025:1025 mailhog/mailhog)\n# so test mail never leaves your machine.',
        },
        resources: [
          { label: 'GoPhish — Open-source phishing toolkit', url: 'https://getgophish.com/' },
          {
            label: 'CISA — Avoiding social engineering & phishing',
            url: 'https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks',
          },
          {
            label: 'Professor Messer — Social engineering',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'Which psychological principles did your lure exploit (authority, urgency, scarcity, trust)?',
          'How does spear phishing differ from standard phishing, and how does whaling differ from both?',
          'What specific user training and process controls mitigate this, and how would you measure their effectiveness?',
        ],
        examTieIn: {
          code: '2.2',
          text: 'Explain common threat vectors and attack surfaces.',
        },
      },
    ],
  },
  {
    id: '3',
    code: 'Domain 3',
    title: 'Security Architecture',
    weight: 18,
    description:
      'How you design systems so that a single failure does not become a breach: segmentation, zero trust, cloud identity, and data protection. This domain rewards thinking in terms of trust boundaries and blast radius.',
    exercises: [
      {
        id: '3.1',
        code: 'Exercise 3.1',
        title: 'Network Segmentation with pfSense',
        xp: XP_PER_EXERCISE,
        concept: [
          'Flat networks are a breach amplifier — once an attacker lands anywhere, they can reach everywhere. Segmentation breaks the network into zones with controlled crossing points, so a compromise in one zone does not automatically grant the others. A DMZ is the classic pattern: a buffer zone for internet-facing services that is isolated from the internal LAN.',
          'Firewall rules express least privilege at the network layer: permit only the specific flows the business requires and deny the rest by default. The web server in a DMZ should accept HTTP from the outside but must never be allowed to initiate connections inward to the LAN, because that is exactly the path an attacker would pivot through.',
          'Zero trust takes this further — it stops trusting traffic just because it is "inside," and instead authenticates and authorizes every flow. Building a three-interface pfSense firewall makes these abstractions concrete: you will write the rules and then prove the DMZ cannot reach the LAN.',
        ],
        directive: {
          intro:
            'Build this entirely inside VirtualBox using internal/host-only networks so nothing touches your real LAN.',
          steps: [
            'Deploy pfSense in VirtualBox with three adapters mapped to WAN, LAN, and DMZ networks.',
            'Place a simple Apache server (Ubuntu) on the DMZ network and a client on the LAN network.',
            'Write a rule permitting HTTP (tcp/80) from WAN to the DMZ web server.',
            'Write an explicit rule BLOCKING any traffic initiated from DMZ to LAN.',
            'Test: browse to the web server from the WAN side (allowed), then try to reach the LAN client from the DMZ server (blocked).',
            'Capture the before/after and explain how your ruleset enforces least privilege.',
          ],
          snippet:
            '# Conceptual ruleset (implement via the pfSense GUI: Firewall > Rules)\n# WAN  -> DMZ:80/tcp   ALLOW   (publish the web service)\n# DMZ  -> LAN:any      BLOCK   (prevent inward pivot)\n# DMZ  -> WAN:443/tcp  ALLOW   (updates only)\n# default                DENY   (implicit deny-all)',
        },
        resources: [
          {
            label: 'pfSense — Official documentation',
            url: 'https://docs.netgate.com/pfsense/en/latest/',
          },
          {
            label: 'NIST SP 800-207 — Zero Trust Architecture',
            url: 'https://csrc.nist.gov/pubs/sp/800/207/final',
          },
          {
            label: 'Professor Messer — Network segmentation & zero trust',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'What is the security purpose of a DMZ, and what would an attacker gain if the DMZ could reach the LAN?',
          'What single rule best expresses least privilege in your ruleset, and why?',
          'How does this segmentation relate to zero trust architecture — and where does it fall short of true zero trust?',
        ],
        examTieIn: {
          code: '3.1',
          text: 'Compare and contrast security implications of different architecture models.',
        },
      },
      {
        id: '3.2',
        code: 'Exercise 3.2',
        title: 'Cloud IAM Lab (AWS Free Tier)',
        xp: XP_PER_EXERCISE,
        concept: [
          'In the cloud, identity is the perimeter. There is no firewall between you and the world — there is only what each identity is permitted to do. AWS IAM governs that with users, groups, roles, and policies, and the single most important principle is least privilege: grant exactly the permissions required and nothing more.',
          'You will feel the difference viscerally by creating two users — one with S3 read-only, one with full access — and watching the read-only user get an explicit AccessDenied when it tries to write. That denied API call is least privilege working as designed.',
          'IAM tells you what is allowed; it does not tell you what happened. CloudTrail does. It records every API call as an event, giving you the audit trail and accounting layer the cloud equivalent of AAA. Together, IAM plus CloudTrail are the backbone of cloud security posture.',
        ],
        directive: {
          intro:
            'Use the AWS Free Tier. Set a billing alarm first, and delete the resources when you finish to avoid charges.',
          steps: [
            'Create an AWS Free Tier account and enable a billing/budget alarm.',
            'Create two IAM users: one attached to AmazonS3ReadOnlyAccess, one to AmazonS3FullAccess.',
            'Create an S3 bucket and put a test object in it.',
            'Configure the AWS CLI with each user’s keys (separate profiles) and try to upload a file as each.',
            'Confirm the read-only user receives AccessDenied on the write — the least-privilege boundary.',
            'Enable CloudTrail, then find your own GetObject/PutObject calls in the event history.',
          ],
          snippet:
            '# Two profiles in ~/.aws/credentials, then:\naws s3 ls s3://my-lab-bucket --profile readonly        # works\naws s3 cp note.txt s3://my-lab-bucket/ --profile readonly   # AccessDenied\naws s3 cp note.txt s3://my-lab-bucket/ --profile fullaccess # succeeds\n\n# Review the trail\naws cloudtrail lookup-events --max-results 10',
        },
        resources: [
          {
            label: 'AWS IAM — User guide',
            url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html',
          },
          {
            label: 'AWS CloudTrail — User guide',
            url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html',
          },
          {
            label: 'AWS — IAM security best practices',
            url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html',
          },
        ],
        prompts: [
          'What is the principle of least privilege, and precisely how did your two-user setup demonstrate it?',
          'What does CloudTrail give you that IAM policies alone cannot?',
          'Which SY0-701 area does cloud logging and asset visibility fall under?',
        ],
        examTieIn: {
          code: '3.6',
          text: 'Explain the security implications of proper hardware, software, and data asset management.',
        },
      },
      {
        id: '3.3',
        code: 'Exercise 3.3',
        title: 'Data Classification and DLP Simulation',
        xp: XP_PER_EXERCISE,
        concept: [
          'You cannot protect data uniformly — a marketing brochure and a customer’s SSN do not warrant the same controls. Classification schemes (Public, Internal, Confidential, Restricted, or government Unclassified→Top Secret) assign each piece of data a tier so that protection scales with sensitivity. Classification is the prerequisite for every downstream control.',
          'Data Loss Prevention (DLP) tools enforce those tiers in motion: they inspect content for sensitive patterns — SSNs, credit-card numbers (validated with the Luhn check), health identifiers — and block, quarantine, or alert when such data tries to leave a boundary. DLP complements encryption rather than replacing it: encryption protects data at rest and in transit, while DLP controls where data is allowed to go.',
          'You will build a miniature DLP engine in Python: a regex scanner that walks a classified folder tree and flags files containing sensitive patterns, then reason about what a real enterprise DLP product adds (context, OCR, exact-data matching, policy enforcement).',
        ],
        directive: {
          intro:
            'Pure local Python — no cloud, no VM. Use clearly fake test data (never real PII).',
          steps: [
            'Create a folder tree: data/{public,internal,confidential,restricted} and drop sample text files in each.',
            'Seed some files with FAKE SSNs, FAKE credit-card-format numbers, and email addresses.',
            'Write a Python script that walks the tree and applies regexes for each pattern.',
            'Have it print each file with its matched pattern types and a suggested classification.',
            'Run it, review the flags, and note any false positives.',
            'Write a paragraph on what a commercial DLP would do that your regex cannot (Luhn validation, context, fingerprinting, blocking egress).',
          ],
          snippet:
            'import os, re\nPATTERNS = {\n    "ssn": re.compile(r"\\b\\d{3}-\\d{2}-\\d{4}\\b"),\n    "cc":  re.compile(r"\\b(?:\\d[ -]*?){13,16}\\b"),\n    "email": re.compile(r"\\b[\\w.+-]+@[\\w-]+\\.[\\w.-]+\\b"),\n}\nfor root, _, files in os.walk("data"):\n    for f in files:\n        text = open(os.path.join(root, f), errors="ignore").read()\n        hits = [name for name, rx in PATTERNS.items() if rx.search(text)]\n        if hits:\n            print(f"[FLAG] {os.path.join(root, f)} -> {hits}")',
        },
        resources: [
          {
            label: 'NIST SP 800-122 — Protecting PII',
            url: 'https://csrc.nist.gov/pubs/sp/800/122/final',
          },
          {
            label: 'Python re — Regular expression docs',
            url: 'https://docs.python.org/3/library/re.html',
          },
          {
            label: 'Professor Messer — Data classification & DLP',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'What classification level would PII typically fall under, and who decides the scheme?',
          'What is the difference between DLP and encryption as controls, and why do you usually deploy both?',
          'What does SY0-701 say about data sovereignty, and how does it constrain where regulated data may live?',
        ],
        examTieIn: {
          code: '3.3',
          text: 'Compare and contrast concepts and strategies to protect data.',
        },
      },
    ],
  },
  {
    id: '4',
    code: 'Domain 4',
    title: 'Security Operations',
    weight: 28,
    description:
      'The largest scored domain. Day-to-day defense: monitoring with a SIEM, responding to incidents, hardening systems, and managing the detection-and-response lifecycle. If Domain 2 is the offense, this is the defense that earns the paycheck.',
    exercises: [
      {
        id: '4.1',
        code: 'Exercise 4.1',
        title: 'SIEM Fundamentals with Elastic Stack',
        xp: XP_PER_EXERCISE,
        concept: [
          'A log aggregator collects logs; a SIEM makes them mean something. Security Information and Event Management platforms centralize logs from across the estate, normalize and correlate them, and raise alerts when patterns match known-bad behavior. The difference is correlation and alerting — a SIEM connects a failed login here to a privilege escalation there into a single story.',
          'The Elastic Stack (Elasticsearch for storage/search, Kibana for visualization) is the most accessible way to feel this for free. By ingesting an Apache access log seeded with anomalies — a burst of 404s from one IP, a sudden spike in traffic, requests for /admin — you will build the dashboards and alert rules a SOC actually lives in.',
          'This is also your first taste of SOC workflow. A Tier 1 analyst watches these dashboards, triages alerts, and escalates. The muscle you build here — turning raw lines into a top-IPs table and a spike rule — is the literal job.',
        ],
        directive: {
          intro:
            'Run Elasticsearch + Kibana locally with Docker Compose. You supply a realistic Apache access log containing a few deliberate anomalies.',
          steps: [
            'Bring up single-node Elasticsearch + Kibana via Docker Compose.',
            'Create or download a realistic Apache access log and inject anomalies (a 404 scan burst, a traffic spike, /admin probes from one IP).',
            'Ingest the log (Filebeat, the Kibana file-upload, or a quick bulk import).',
            'Build a dashboard with: top source IPs, HTTP status-code distribution, and a requests-over-time chart.',
            'Create an alert/threshold rule that fires on an error-rate or request spike.',
            'Identify the anomalous IP and write what a Tier 1 analyst would do next.',
          ],
          snippet:
            '# docker-compose.yml (single-node dev)\nservices:\n  es:\n    image: docker.elastic.co/elasticsearch/elasticsearch:8.14.0\n    environment: ["discovery.type=single-node", "xpack.security.enabled=false"]\n    ports: ["9200:9200"]\n  kibana:\n    image: docker.elastic.co/kibana/kibana:8.14.0\n    ports: ["5601:5601"]\n    depends_on: ["es"]\n# Kibana: http://localhost:5601  ->  upload the log, build the dashboard',
        },
        resources: [
          {
            label: 'Elastic — Run Elasticsearch with Docker',
            url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html',
          },
          {
            label: 'Elastic — Kibana dashboards',
            url: 'https://www.elastic.co/guide/en/kibana/current/dashboard.html',
          },
          {
            label: 'Professor Messer — SIEM & monitoring',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'What is the difference between a SIEM and a plain log aggregator?',
          'What IOC did you find in the access log, and what made it stand out from the baseline?',
          'What would a Tier 1 SOC analyst do next after this alert fires?',
        ],
        examTieIn: {
          code: '4.3',
          text: 'Explain various activities associated with vulnerability management.',
        },
      },
      {
        id: '4.2',
        code: 'Exercise 4.2',
        title: 'Incident Response Tabletop',
        xp: XP_PER_EXERCISE,
        concept: [
          'When the alarm fires at 2am, improvisation costs you. Incident response is a rehearsed lifecycle so the team executes instead of panicking. SY0-701 frames it as PICERL: Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned — each phase with distinct goals, decisions, and stakeholders.',
          'The hardest judgment calls live between the phases. Containment may destroy volatile evidence, so you preserve first — memory, logs, disk images — with documented chain of custody before you pull the plug. Notification timing (legal, compliance, regulators, the public) is a phase-aware decision, not an afterthought, and in a hospital it can carry HIPAA breach-notification clocks.',
          'This is a written tabletop — no tools, just the runbook you would actually follow. Walking a realistic ransomware scenario through every PICERL phase is exactly how mature teams pressure-test their plan before a real incident does it for them.',
        ],
        directive: {
          intro:
            'Pure writing exercise. The scenario: 2am ransomware alert on a hospital network — 3 servers encrypted, Active Directory still accessible. You are the IR lead. Produce a runbook.',
          steps: [
            'Preparation: list what should already exist (backups, contacts, IR plan, logging) that you are relying on.',
            'Identification: how do you confirm scope and severity, and what telemetry tells you AD is or isn’t compromised?',
            'Containment: short-term and long-term isolation steps — and what evidence you preserve BEFORE acting.',
            'Eradication: how you remove the foothold and ensure the actor is truly out.',
            'Recovery: how you restore safely, validate integrity, and decide on the go/no-go to reconnect.',
            'Lessons Learned: the after-action review and what you would change. Note exactly when legal/compliance get called.',
          ],
          snippet:
            '# PICERL runbook skeleton\nPreparation     -> backups verified? IR contacts? comms plan?\nIdentification  -> scope, severity, AD compromise check, declare incident\nContainment     -> PRESERVE first (memory/disk/logs + chain of custody),\n                   then isolate (network segment, disable accounts)\nEradication     -> remove persistence, reset credentials, patch entry vector\nRecovery        -> restore from known-good backup, validate, monitor\nLessons Learned -> AAR, metrics, plan updates',
        },
        resources: [
          {
            label: 'NIST SP 800-61r3 — Incident response',
            url: 'https://csrc.nist.gov/pubs/sp/800/61/r3/final',
          },
          {
            label: 'SANS — Incident handler’s handbook',
            url: 'https://www.sans.org/white-papers/33901/',
          },
          {
            label: 'Professor Messer — Incident response',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'At what phase do you notify legal/compliance, and what triggers a HIPAA breach-notification clock?',
          'What evidence must be preserved BEFORE containment, and why can containment destroy it?',
          'How does SY0-701 define chain of custody, and what does a break in it cost you?',
        ],
        examTieIn: {
          code: '4.8',
          text: 'Explain appropriate incident response activities.',
        },
      },
      {
        id: '4.3',
        code: 'Exercise 4.3',
        title: 'Hardening a Linux Server',
        xp: XP_PER_EXERCISE,
        concept: [
          'Every service you run, port you open, and account you leave enabled is attack surface. Hardening is the systematic reduction of that surface to the minimum the system needs to do its job — the principle of least functionality. Patching closes known holes; hardening removes the holes you never needed in the first place. They are complementary, not the same.',
          'Benchmarks turn hardening from opinion into a checklist. The CIS Benchmarks define consensus-driven, testable configurations per platform, and tools like Lynis audit a host against best practice and hand you a score plus a prioritized to-do list. Measuring before and after turns hardening into something you can prove.',
          'You will take a fresh Ubuntu box, baseline it with Lynis, apply a focused set of controls — SSH lockdown, password policy, host firewall, service minimization, auditing — and re-score to quantify the improvement.',
        ],
        directive: {
          intro:
            'Use a throwaway Ubuntu 22.04 VM. Snapshot it first so you can roll back.',
          steps: [
            'Install Lynis and run "lynis audit system" to capture a BASELINE hardening index.',
            'Disable root SSH login (PermitRootLogin no) and restart sshd.',
            'Set password policy via PAM (pam_pwquality: min length, complexity) and login.defs aging.',
            'Enable and configure the host firewall: ufw default deny incoming, allow only what you need.',
            'Disable unnecessary services with systemctl and install/enable auditd for system auditing.',
            'Re-run Lynis and document the before/after score and which controls moved the needle.',
          ],
          snippet:
            '# Baseline\nsudo apt install -y lynis auditd && sudo lynis audit system\n\n# A few hardening moves\nsudo sed -i \'s/^#\\?PermitRootLogin.*/PermitRootLogin no/\' /etc/ssh/sshd_config\nsudo systemctl restart ssh\nsudo ufw default deny incoming && sudo ufw allow OpenSSH && sudo ufw enable\nsudo systemctl disable --now avahi-daemon cups 2>/dev/null\nsudo systemctl enable --now auditd\n\n# Re-score\nsudo lynis audit system          # compare the hardening index',
        },
        resources: [
          { label: 'CIS Benchmarks', url: 'https://www.cisecurity.org/cis-benchmarks' },
          { label: 'Lynis — CISOfy', url: 'https://cisofy.com/lynis/' },
          {
            label: 'Ubuntu Server — Security hardening',
            url: 'https://ubuntu.com/server/docs/security-introduction',
          },
        ],
        prompts: [
          'What is the purpose of a security baseline, and how do you keep a host from drifting away from it?',
          'How does SY0-701 differentiate hardening from patching?',
          'Which CIS Benchmark categories do your changes map to (SSH, accounts, firewall, auditing)?',
        ],
        examTieIn: {
          code: '4.1',
          text: 'Given a scenario, apply common security techniques to computing resources.',
        },
      },
    ],
  },
  {
    id: '5',
    code: 'Domain 5',
    title: 'Security Program Management & Oversight',
    weight: 20,
    description:
      'The governance layer: risk, compliance, policy, and the human program that holds it all together. This domain is where security stops being a tool and becomes a business function the C-suite has to fund and defend.',
    exercises: [
      {
        id: '5.1',
        code: 'Exercise 5.1',
        title: 'Risk Assessment',
        xp: XP_PER_EXERCISE,
        concept: [
          'Risk is not the same as a threat or a vulnerability — it is the expected loss when a threat exploits a vulnerability, shaped by likelihood and impact. Risk management is the discipline of identifying those risks, scoring them consistently, and deciding what to do about each one before it materializes.',
          'There are four responses to any risk: mitigate (reduce it with a control), transfer (shift it, e.g. to an insurer), avoid (stop doing the risky thing), or accept (consciously live with it). After you apply a control, what remains is residual risk, and acceptance is only appropriate when residual risk falls within the organization’s risk appetite — a documented decision, never a shrug.',
          'A risk register is the artifact that makes this real: each risk with its likelihood, impact, score, owner, and chosen treatment. You will build one for a small fictional business, which is exactly the kind of scenario SY0-701 asks you to reason about.',
        ],
        directive: {
          intro:
            'No tools beyond a spreadsheet. Pick a small fictional company — a dental office, a food truck, a law firm — and build a real register.',
          steps: [
            'Choose your fictional company and write two sentences on what it does and what data it holds.',
            'Identify 5 realistic threats (ransomware, lost laptop, insider error, phishing, supplier outage…).',
            'For each, score Likelihood 1–5 and Impact 1–5.',
            'Compute Risk Score = Likelihood × Impact and rank the list.',
            'Propose one specific control per risk and label its treatment type (mitigate/transfer/avoid/accept).',
            'Note the residual risk for your highest-scoring item after the control is applied.',
          ],
          snippet:
            '# Risk register columns (spreadsheet)\nID | Risk description | Likelihood(1-5) | Impact(1-5) | Score(LxI) | Owner | Treatment | Control | Residual\n\n# Example row\nR1 | Ransomware via phishing | 4 | 5 | 20 | IT Lead | Mitigate | EDR + offline backups + training | Medium',
        },
        resources: [
          {
            label: 'NIST SP 800-30 — Guide for conducting risk assessments',
            url: 'https://csrc.nist.gov/pubs/sp/800/30/r1/final',
          },
          {
            label: 'NIST SP 800-37 — Risk Management Framework',
            url: 'https://csrc.nist.gov/pubs/sp/800/37/r2/final',
          },
          {
            label: 'Professor Messer — Risk management',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'What is the difference between risk transference and risk mitigation? Give an example of each from your register.',
          'How does SY0-701 define residual risk, and how does it relate to risk appetite?',
          'When is risk acceptance appropriate, and who in the organization should sign off on it?',
        ],
        examTieIn: {
          code: '5.2',
          text: 'Explain elements of the risk management process.',
        },
      },
      {
        id: '5.2',
        code: 'Exercise 5.2',
        title: 'Compliance Mapping',
        xp: XP_PER_EXERCISE,
        concept: [
          'Frameworks and regulations are different animals that students constantly conflate. A regulation (HIPAA, PCI-DSS, GDPR) is mandatory and carries legal or contractual penalties. A framework (NIST CSF, ISO 27001) is a voluntary structure for organizing controls. NIST CSF is not a law — it is a common language that many regulations and audits happen to align with.',
          'The practical superpower is mapping: a single well-designed control often satisfies several frameworks at once. Encrypting cardholder data satisfies a PCI-DSS requirement, supports GDPR’s "appropriate technical measures," and sits squarely under the CSF Protect function. Map once, comply many — that is how mature programs avoid doing the same work five times.',
          'You will take the free NIST CSF 2.0 core, pick the Protect function, and map a few of its categories to concrete controls for a hypothetical e-commerce company — then show where PCI-DSS and GDPR overlap the very same controls.',
        ],
        directive: {
          intro:
            'Download the free NIST CSF 2.0 core. Your scenario is a hypothetical e-commerce company that stores customer accounts and processes card payments.',
          steps: [
            'Download the NIST CSF 2.0 core and skim the six functions (Govern, Identify, Protect, Detect, Respond, Recover).',
            'Focus on the PROTECT function and pick 3 categories (e.g. Identity Management & Access Control, Data Security, Platform Security).',
            'For each category, write one concrete control you would implement for the e-commerce company.',
            'For each control, note which PCI-DSS requirement and which GDPR principle it also helps satisfy.',
            'Summarize the overlap in a small table — one control, multiple frameworks.',
            'State plainly which of these are mandatory for the company and which are voluntary.',
          ],
          snippet:
            '# Mapping table\nCSF 2.0 (Protect) Category | Control implemented | PCI-DSS | GDPR\nData Security (PR.DS)      | Encrypt cardholder + PII data at rest/in transit | Req 3 & 4 | Art. 32\nAccess Control (PR.AA)     | MFA + least privilege on admin consoles | Req 7 & 8 | Art. 32\nPlatform Security (PR.PS)  | Patch & harden web/app servers | Req 6 | Art. 32',
        },
        resources: [
          {
            label: 'NIST Cybersecurity Framework 2.0',
            url: 'https://www.nist.gov/cyberframework',
          },
          {
            label: 'PCI Security Standards Council',
            url: 'https://www.pcisecuritystandards.org/',
          },
          {
            label: 'GDPR — Official regulation text',
            url: 'https://gdpr-info.eu/',
          },
        ],
        prompts: [
          'What is the difference between a framework and a regulation? Classify NIST CSF, HIPAA, PCI-DSS, and GDPR.',
          'Is NIST CSF mandatory? When would an organization adopt it anyway?',
          'Which SY0-701 objective covers compliance, and what does it expect you to know about audits and attestation?',
        ],
        examTieIn: {
          code: '5.4',
          text: 'Summarize elements of effective security compliance.',
        },
      },
      {
        id: '5.3',
        code: 'Exercise 5.3',
        title: 'Security Awareness Program Design',
        xp: XP_PER_EXERCISE,
        concept: [
          'Governance documents form a hierarchy that SY0-701 expects you to keep straight. A policy is a high-level statement of intent ("we protect customer data"). A standard is a mandatory, specific rule that supports a policy ("passwords are at least 14 characters"). A procedure is the step-by-step how-to. A guideline is recommended but optional. An Acceptable Use Policy (AUP) is a specific policy defining what users may and may not do with company systems.',
          'A security awareness program is how policy reaches people. The goal is behavior change, not a once-a-year video. Effective programs are continuous, role-relevant, and reinforced with simulations — and crucially, they are measured. Without metrics, awareness training is checkbox compliance that changes nothing.',
          'You will design the program end to end: write a one-page AUP, outline a three-module training curriculum, and define the metrics — phishing click rate, training completion, reported-phishing rate — you would put in front of the C-suite to prove it is working.',
        ],
        directive: {
          intro:
            'Pure writing/design exercise for a hypothetical 50-person company. Produce documents a real security lead could hand to HR and the board.',
          steps: [
            'Write a one-page Acceptable Use Policy covering acceptable use, prohibited activity, data handling, and consequences.',
            'Outline a 3-module security awareness curriculum (e.g. Phishing & social engineering, Passwords & MFA, Data handling & incident reporting).',
            'For each module, note the format, the audience, and the cadence.',
            'Define the metrics you would track: phishing click rate, report rate, training completion %, time-to-report.',
            'Explain how you would present those metrics to the C-suite — trend lines, risk reduction, dollar framing.',
            'State how you would tell a genuinely effective program apart from checkbox compliance.',
          ],
          snippet:
            '# AUP skeleton\n1. Purpose & scope\n2. Acceptable use (business systems, email, internet)\n3. Prohibited use (sharing credentials, shadow IT, data exfil)\n4. Data handling by classification\n5. Monitoring & privacy notice\n6. Consequences of violation\n7. Acknowledgement (signed annually)\n\n# Board metrics: click rate (down), report rate (up), completion %, mean time-to-report',
        },
        resources: [
          {
            label: 'NIST SP 800-50r1 — Security awareness & training',
            url: 'https://csrc.nist.gov/pubs/sp/800/50/r1/final',
          },
          {
            label: 'SANS Security Awareness',
            url: 'https://www.sans.org/security-awareness-training/',
          },
          {
            label: 'Professor Messer — Policies & awareness',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'What is the difference between a policy, a standard, and a procedure? Place an AUP in that hierarchy.',
          'How does SY0-701 categorize AUPs, and what makes them enforceable?',
          'What separates a security awareness program that changes behavior from one that is merely checkbox compliance?',
        ],
        examTieIn: {
          code: '5.6',
          text: 'Explain the importance of security awareness practices.',
        },
      },
    ],
  },
]

// ---- Derived helpers ---------------------------------------------------

// Flat list of every exercise with its parent domain id attached.
export const allExercises = domains.flatMap((d) =>
  d.exercises.map((ex) => ({ ...ex, domainId: d.id })),
)

export const TOTAL_EXERCISES = allExercises.length // 15

export function getDomain(id) {
  return domains.find((d) => d.id === String(id))
}

export function getExercise(domainId, exerciseId) {
  const domain = getDomain(domainId)
  if (!domain) return null
  return domain.exercises.find((ex) => ex.id === String(exerciseId)) || null
}
