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
      {
        id: '1.4',
        code: 'Exercise 1.4',
        title: 'Cryptography in Practice',
        xp: XP_PER_EXERCISE,
        concept: [
          'Theory becomes intuition the moment you watch a hash change and a certificate get issued with your own hands. A cryptographic hash like SHA-256 produces a fixed-length fingerprint that is computationally infeasible to reverse and that changes completely if even one bit of input changes. It is the everyday tool for verifying that a download, a backup, or an evidence file has not been tampered with.',
          'Certificates bind a public key to an identity and are the backbone of TLS, code signing, and S/MIME. A self-signed certificate is one where the subject and the issuer are the same entity — there is no external Certificate Authority vouching for it. That makes it perfect for learning and for internal services, but it is also exactly why your browser warns you: nothing trusted attests to the identity.',
          'In this lab you will compute and verify file hashes, then generate a self-signed X.509 certificate with OpenSSL and read its fields — subject, issuer, validity window, public key, and signature algorithm. Seeing those fields is what turns "PKI" from a buzzword into a structure you can reason about.',
        ],
        directive: {
          intro:
            'You only need OpenSSL and a shell with sha256sum (Linux/macOS, or Git Bash / WSL on Windows). No VM required — work in a throwaway directory.',
          steps: [
            'Create a file and hash it: echo "integrity matters" > artifact.txt then sha256sum artifact.txt — record the digest.',
            'Make a copy, change one character, and hash both. Confirm the digests are completely different (the avalanche effect).',
            'Generate a 2048-bit RSA key and a self-signed certificate in one command (see snippet). Answer the prompts for Country, Org, and Common Name.',
            'Print the certificate in human-readable form with openssl x509 -text -noout and locate the Subject, Issuer, Validity, and Signature Algorithm fields.',
            'Note that Subject and Issuer are identical — that is the definition of self-signed — and explain why a browser would not trust it by default.',
            'Write two sentences: what does the hash prove that the certificate does not, and what does the certificate provide that a bare hash does not?',
          ],
          snippet:
            '# Hashing\nsha256sum artifact.txt                 # record the digest\ncp artifact.txt artifact2.txt && echo x >> artifact2.txt\nsha256sum artifact.txt artifact2.txt   # digests diverge completely\n\n# Self-signed cert (key + cert in one step)\nopenssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem \\\n  -days 365 -nodes -subj "/C=US/O=sec-labs/CN=lab.local"\n\n# Read the fields\nopenssl x509 -in cert.pem -text -noout  # Subject == Issuer -> self-signed',
        },
        resources: [
          {
            label: 'OpenSSL — req command documentation',
            url: 'https://docs.openssl.org/master/man1/openssl-req/',
          },
          {
            label: 'NIST — Hash functions',
            url: 'https://csrc.nist.gov/projects/hash-functions',
          },
          {
            label: 'Professor Messer — Public key infrastructure',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'What property of SHA-256 makes it useful for integrity verification but useless for confidentiality?',
          'Why does a browser warn on a self-signed certificate, and what would make the same certificate trusted?',
          'Which certificate fields would you inspect to decide whether to trust a server, and why?',
        ],
        examTieIn: {
          code: '1.4',
          text: 'Explain the importance of using appropriate cryptographic solutions.',
        },
      },
      {
        id: '1.5',
        code: 'Exercise 1.5',
        title: 'Zero Trust Architecture',
        xp: XP_PER_EXERCISE,
        concept: [
          'The old model trusted the network: get inside the perimeter and you were assumed friendly. Zero trust discards that assumption entirely. Its mantra is "never trust, always verify" — every request to every resource is authenticated, authorized, and encrypted regardless of where it originates, inside or outside the corporate network.',
          'NIST SP 800-207 splits a zero trust architecture into a control plane and a data plane. The Policy Decision Point (PDP) — made of a Policy Engine and Policy Administrator — decides whether a request is allowed; the Policy Enforcement Point (PEP) sits in the data path and actually grants or blocks access. Decisions are dynamic and per-session, factoring in identity, device posture, and context rather than a one-time login.',
          'In this lab you will diagram a zero trust architecture and confront where implicit trust currently hides in a typical network — flat VLANs, "internal" services with no auth, shared admin accounts — then write an access policy that replaces each instance of implicit trust with an explicit verification step.',
        ],
        directive: {
          intro:
            'A free draw.io (diagrams.net) account or the desktop app is all you need. The deliverables are a diagram and a short written policy.',
          steps: [
            'In draw.io, diagram a small network: users, devices, a PEP (gateway/proxy), the PDP (policy engine + administrator), and two protected resources.',
            'Draw every access request routing through the PEP — no resource is reachable without passing the enforcement point.',
            'Make a two-column list: places where the legacy design grants implicit trust vs. how zero trust would verify instead (e.g. "on-VLAN = allowed" becomes "device posture + identity checked per request").',
            'Identify the trust algorithm inputs your PDP would evaluate: identity, device health, location, time, and resource sensitivity.',
            'Write a 5-point access policy in plain language — each point an explicit, verifiable rule (least privilege, MFA, device compliance, per-session authZ, continuous evaluation).',
            'Export the diagram and note one thing about your own home or lab network that violates zero trust today.',
          ],
          snippet:
            '# Zero trust logical flow (sketch this in draw.io)\nSubject (user+device)\n      |  request\n      v\n  [ PEP ]  --- query --->  [ PDP: Policy Engine + Policy Administrator ]\n      |                          ^  inputs: identity, device posture,\n      |  allow/deny (per session)    location, time, resource sensitivity\n      v\n  Protected Resource\n\n# 5-point policy skeleton\n1. Authenticate every subject with MFA, every session\n2. Authorize per-request against least-privilege roles\n3. Require device compliance (patch level, EDR present)\n4. Encrypt all flows, internal and external\n5. Continuously evaluate; revoke on posture/context change',
        },
        resources: [
          {
            label: 'NIST SP 800-207 — Zero Trust Architecture',
            url: 'https://csrc.nist.gov/pubs/sp/800/207/final',
          },
          {
            label: 'diagrams.net (draw.io)',
            url: 'https://www.drawio.com/',
          },
          {
            label: 'CISA — Zero Trust Maturity Model',
            url: 'https://www.cisa.gov/zero-trust-maturity-model',
          },
        ],
        prompts: [
          'What is the difference between a Policy Decision Point and a Policy Enforcement Point in NIST 800-207?',
          'Where does implicit trust hide in a traditional perimeter network, and how does zero trust remove it?',
          'How do device posture and context change an access decision compared with a one-time login?',
        ],
        examTieIn: {
          code: '1.2',
          text: 'Summarize fundamental security concepts.',
        },
      },
      {
        id: '1.6',
        code: 'Exercise 1.6',
        title: 'Authentication Deep Dive',
        xp: XP_PER_EXERCISE,
        concept: [
          'Authentication factors fall into categories: something you know (password, PIN), something you have (a token, phone, smart card), something you are (biometrics), somewhere you are (geolocation), and something you do (behavioral). Multifactor authentication combines factors from different categories — two passwords are not MFA, but a password plus a TOTP code is.',
          'TOTP (Time-based One-Time Password, RFC 6238) is the six-digit code an authenticator app generates. It derives the code from a shared secret and the current time window, so it changes every 30 seconds and requires no network connection. It is a strong second factor, but it is still phishable: a victim can be tricked into typing the live code into a fake site.',
          'Phishing-resistant authentication closes that gap. FIDO2/WebAuthn passkeys bind the credential to the legitimate site\'s origin and use public-key cryptography, so there is no shared secret to steal and no code to relay. In this lab you will stand up TOTP yourself, compare the factor strengths honestly, and document why a passkey beats a one-time code against phishing.',
        ],
        directive: {
          intro:
            'Use a free authenticator app (Google Authenticator, Microsoft Authenticator, Aegis, or Ente Auth). No account required — you can enroll against a test secret.',
          steps: [
            'Enable two-step verification with TOTP on a free account you control (e.g. a throwaway email or GitHub), or generate a test secret with a TOTP demo site.',
            'Scan the QR code / enter the secret into your authenticator app and confirm the rolling 6-digit code is accepted.',
            'Observe that the code changes every 30 seconds and works with the device in airplane mode — note why (time + shared secret, no network).',
            'Build a comparison table of factors: password, SMS OTP, TOTP, push approval, and FIDO2 passkey — rate each on phishing resistance and usability.',
            'Document a phishing-resistant auth flow end to end using a passkey (registration binds to origin; login uses challenge-response with the private key never leaving the device).',
            'Write two sentences on why TOTP can still be phished in real time but a WebAuthn passkey cannot.',
          ],
          snippet:
            '# Factor categories (Sec+ taxonomy)\nKnowledge  -> password, PIN            (cheapest, most phishable)\nPossession -> TOTP app, security key   (TOTP phishable; FIDO2 not)\nInherence  -> fingerprint, face         (hard to revoke if breached)\nLocation   -> GPS / IP geofence         (context, not standalone)\n\n# Why a passkey resists phishing:\n#  - credential is bound to the site origin (RP ID)\n#  - challenge-response with a private key that never leaves the device\n#  - no shared secret or OTP for a fake site to relay',
        },
        resources: [
          {
            label: 'RFC 6238 — TOTP: Time-Based One-Time Password',
            url: 'https://datatracker.ietf.org/doc/html/rfc6238',
          },
          {
            label: 'FIDO Alliance — Passkeys / WebAuthn',
            url: 'https://fidoalliance.org/passkeys/',
          },
          {
            label: 'Professor Messer — Authentication & MFA',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'Why is a password plus a PIN not true multifactor authentication?',
          'How does TOTP generate a code with no network connection, and what is its main weakness?',
          'What makes a FIDO2 passkey phishing-resistant where TOTP and SMS OTP are not?',
        ],
        examTieIn: {
          code: '1.2',
          text: 'Summarize fundamental security concepts.',
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
      {
        id: '2.4',
        code: 'Exercise 2.4',
        title: 'Vulnerability Scanning Basics',
        xp: XP_PER_EXERCISE,
        concept: [
          'Finding weaknesses at scale is what a vulnerability scanner does: it fingerprints services, matches versions against a database of known CVEs, and assigns each finding a CVSS severity. But a raw scan report is noise until you prioritize it — a small business cannot patch 400 findings at once, so the skill SY0-701 tests is triage, not just discovery.',
          'CVSS (Common Vulnerability Scoring System) rates a vulnerability 0.0–10.0 across base metrics like attack vector, attack complexity, privileges required, and the confidentiality/integrity/availability impact. A 9.8 reachable from the network with no authentication is a drop-everything emergency; a 5.0 requiring local access and user interaction can wait. Context matters too: a critical CVE on an isolated lab box is lower real risk than a medium one on your internet-facing gateway.',
          'In this lab you will run Greenbone Community Edition (the OpenVAS engine) against a vulnerable VM on an isolated network, read the CVSS scores it produces, and defend a top-three prioritization that weighs severity against exposure and exploitability — exactly the judgment a vulnerability-management analyst is paid for.',
        ],
        directive: {
          intro:
            'Critical safety rule: scan only a VM you own, on a HOST-ONLY network. Never point a scanner at systems you do not control. Metasploitable 2 or a deliberately vulnerable VM is the safe target.',
          steps: [
            'Set up a target VM (Metasploitable 2 or an old unpatched Linux) in VirtualBox with a Host-only adapter.',
            'Install Greenbone Community Edition (OpenVAS) — the Docker compose images are the fastest path — and let the feed sync.',
            'Run a Full and Fast scan against the target VM\'s host-only IP and wait for the report.',
            'Open the report and sort findings by CVSS score; note how many Critical/High/Medium/Low it produced.',
            'Pick your top 3 to remediate first and write one sentence each justifying the rank using severity + exposure + exploitability (not severity alone).',
            'Look up your #1 finding\'s CVE in the NIST NVD, read its CVSS vector string, and record the recommended remediation.',
          ],
          snippet:
            '# Greenbone Community Edition via Docker (fastest setup)\n# Follow the official compose guide, then browse to https://127.0.0.1:9392\n\n# Reading a CVSS v3.1 vector, e.g.:\n#   CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H  = 9.8 Critical\n#   AV:N  network-reachable      PR:N  no privileges needed\n#   AC:L  low complexity          UI:N  no user interaction\n# => prioritize internet-reachable, no-auth, high-impact findings first',
        },
        resources: [
          {
            label: 'Greenbone Community Edition — Documentation',
            url: 'https://greenbone.github.io/docs/latest/',
          },
          {
            label: 'FIRST — CVSS v3.1 specification & calculator',
            url: 'https://www.first.org/cvss/calculator/3.1',
          },
          {
            label: 'NIST NVD — CVE search',
            url: 'https://nvd.nist.gov/vuln/search',
          },
        ],
        prompts: [
          'What four-ish base metrics drive a CVSS score, and why can a 7.5 be more urgent than a 9.0 in a specific environment?',
          'How did exposure and exploitability change your ranking versus sorting by CVSS alone?',
          'What is the difference between a credentialed and an uncredentialed scan, and when would you use each?',
        ],
        examTieIn: {
          code: '2.5',
          text: 'Explain the purpose of mitigation techniques used to secure the enterprise.',
        },
      },
      {
        id: '2.5',
        code: 'Exercise 2.5',
        title: 'Malware Behavior Analysis',
        xp: XP_PER_EXERCISE,
        concept: [
          'Static analysis reads a file at rest; dynamic (behavioral) analysis watches what it actually does when it runs. Behavioral artifacts — files created, registry keys written, processes spawned, network connections opened — are often the clearest indicators of compromise, because malware can obfuscate its bytes but rarely hides its behavior from the operating system.',
          'You will never detonate real malware on your daily driver. The EICAR test file is a harmless 68-byte string that every antivirus is contractually obligated to flag, letting you exercise the full detonation-and-observation workflow with zero risk. The discipline is the same one used in a real sandbox: isolate, snapshot, run, capture artifacts, revert.',
          'On Windows, Sysinternals Process Monitor captures every file, registry, and process event in real time; on Linux, strace traces the system calls a process makes. By watching even a benign program through these lenses you learn to read the behavioral story — and to recognize the file-write, persistence, and beaconing patterns that signal actual malware.',
        ],
        directive: {
          intro:
            'Use an isolated, snapshotted VM with networking set to Host-only or NAT-only. Snapshot BEFORE you run anything and revert afterward. EICAR is the safe stand-in — do not use live malware.',
          steps: [
            'In a throwaway VM, take a clean snapshot so you can revert after the exercise.',
            'Create the EICAR test file and confirm your AV flags it — that is the expected, safe result.',
            'On Windows: launch Process Monitor, set a filter for a chosen test process, run it, and capture the file/registry/process events. On Linux: run a small program under strace -f and read the syscalls.',
            'Identify the behavioral artifacts: which files were written, which processes were spawned, any registry/persistence writes, any network calls.',
            'Pick three of those artifacts and describe how you would turn each into a detection (a SIEM rule, an EDR signature, a file-integrity alert).',
            'Revert the VM to the clean snapshot and write two sentences on why behavioral IOCs are harder for malware to evade than static signatures.',
          ],
          snippet:
            '# EICAR test string (harmless AV trigger)\nprintf \'X5O!P%%@AP[4\\\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*\' > eicar.com\n\n# Linux behavioral trace\nstrace -f -e trace=file,process,network ./some_test_binary 2>&1 | head -60\n\n# Windows: Sysinternals Process Monitor (procmon.exe)\n#   Filter > add: Process Name is <target>\n#   watch Operation = CreateFile / RegSetValue / Process Create / TCP Connect',
        },
        resources: [
          {
            label: 'EICAR test file — official page',
            url: 'https://www.eicar.org/download-anti-malware-testfile/',
          },
          {
            label: 'Microsoft Sysinternals — Process Monitor',
            url: 'https://learn.microsoft.com/en-us/sysinternals/downloads/procmon',
          },
          {
            label: 'Professor Messer — Indicators of malicious activity',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'What is the difference between static and dynamic malware analysis, and what does each reveal that the other cannot?',
          'Which behavioral artifacts most reliably indicate persistence, and how would you detect them at scale?',
          'Why is isolating and snapshotting the VM non-negotiable before detonation?',
        ],
        examTieIn: {
          code: '2.4',
          text: 'Given a scenario, analyze indicators of malicious activity.',
        },
      },
      {
        id: '2.6',
        code: 'Exercise 2.6',
        title: 'Social Engineering Simulation',
        xp: XP_PER_EXERCISE,
        concept: [
          'Phishing works because it targets people, not patches. Effective lures pull psychological levers: authority (a message that appears to come from the CEO or IT), urgency (act now or lose access), scarcity, familiarity, and the simple human wish to be helpful. Pretexting wraps these in a fabricated but plausible backstory that lowers the target\'s guard before the ask.',
          'Recognizing the cues is the defense. A real lure usually combines a spoofed or look-alike sender, a manufactured deadline, an authority claim, and a single call to action — a link, an attachment, or a request to change payment details. Naming each cue explicitly is what trains both you and the users you will one day defend.',
          'In this lab you will craft a phishing pretext email aimed only at yourself or a lab mailbox you control, deconstruct exactly which cues it uses, and then write the mitigations — technical (DMARC/SPF/DKIM, link rewriting, MFA) and human (reporting culture, out-of-band verification of payment changes) — that blunt each one.',
        ],
        directive: {
          intro:
            'Ethics first and non-negotiable: write this email TO YOURSELF or a lab account you own only. Never send a pretext to anyone who has not authorized it. This is an analysis exercise, not a campaign against real people.',
          steps: [
            'Pick a realistic scenario (e.g. "your mailbox is over quota", "verify your payroll bank details", "your password expires today").',
            'Draft the full email to your own lab address: sender display name, subject line, body, and the single call to action.',
            'Annotate the draft: label each instance of authority, urgency, scarcity, familiarity, and pretext.',
            'Spot the red flags a trained user should catch: mismatched sender domain, hover-mismatched link, generic greeting, unusual request, pressure to bypass process.',
            'Write the technical mitigations (SPF/DKIM/DMARC, attachment sandboxing, link rewriting, MFA so a stolen password is not enough) and the human mitigations (report button, mandatory out-of-band verification of payment changes).',
            'Conclude with the one control you think most reduces this lure\'s success, and why.',
          ],
          snippet:
            '# Pretext deconstruction template\nSubject:  [urgency cue]  e.g. "ACTION REQUIRED: Account locked in 2 hours"\nFrom:     [authority + spoof]  "IT Service Desk <it-desk@l00k-alike.com>"\nBody:     [familiarity] greeting + [pretext] plausible story\nCTA:      single link/attachment/request\n\n# Cue -> mitigation map\nAuthority -> verify out-of-band; DMARC to stop exact-domain spoofing\nUrgency   -> policy: no credential/payment changes under time pressure\nLink      -> hover-check, URL rewriting/sandboxing, web proxy\nCredential theft -> phishing-resistant MFA so the password alone fails',
        },
        resources: [
          {
            label: 'CISA — Avoiding social engineering & phishing',
            url: 'https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks',
          },
          {
            label: 'DMARC.org — How DMARC/SPF/DKIM work together',
            url: 'https://dmarc.org/overview/',
          },
          {
            label: 'Professor Messer — Social engineering',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'Which psychological principle does your lure lean on hardest, and how does pretexting amplify it?',
          'What is the difference between SPF, DKIM, and DMARC, and which spoofing technique does each address?',
          'Why does phishing-resistant MFA reduce the impact of a successful credential-phishing lure?',
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
      {
        id: '3.4',
        code: 'Exercise 3.4',
        title: 'Network Segmentation Lab',
        xp: XP_PER_EXERCISE,
        concept: [
          'Segmentation limits blast radius. When every host can reach every other host, one compromised machine becomes a launchpad for the whole network — this is lateral movement. Dividing the network into isolated segments forces an attacker to cross a controlled boundary to pivot, and that boundary is where you put detection and enforcement.',
          'There are several ways to segment: VLANs separate broadcast domains at layer 2; subnets and routing separate at layer 3; host-only and internal networks in a hypervisor isolate VMs from each other and from the host. Whatever the mechanism, the test of real isolation is simple and unforgiving — can a host in segment A actually reach a host in segment B? You prove it, you do not assume it.',
          'In this lab you will place two VMs in separate isolated networks (host-only or internal) in VirtualBox and then verify the boundary empirically with ping and nmap. A failed ping across the boundary and a clean nmap with no reachable ports is the segmentation working — exactly the verification step auditors and pentesters insist on.',
        ],
        directive: {
          intro:
            'Build this entirely inside VirtualBox using host-only or internal networks so nothing touches your real LAN. Two lightweight Linux VMs are enough.',
          steps: [
            'Create two minimal Linux VMs (e.g. Ubuntu Server or Alpine) in VirtualBox.',
            'First, put both on the SAME host-only network and confirm they can ping each other — your baseline that connectivity works.',
            'Now move VM-B to a DIFFERENT internal/host-only network (or apply firewall rules separating them) to create two segments.',
            'From VM-A, ping VM-B and run nmap against its IP — both should now fail, proving isolation.',
            'Re-enable a single controlled path (e.g. a router VM or a firewall rule allowing only tcp/22) and verify only that one service crosses the boundary.',
            'Document the before/after with command output and explain how this limits lateral movement.',
          ],
          snippet:
            '# Baseline (same segment) — should succeed\nping -c 3 192.168.56.20\nnmap -sn 192.168.56.0/24        # host discovery\n\n# After segmenting (different network) — should fail / show no route\nping -c 3 10.10.20.20           # 100% packet loss = isolated\nnmap -Pn -p 1-1000 10.10.20.20  # all ports filtered/unreachable\n\n# Controlled crossing: allow ONLY ssh, then re-test\nnmap -Pn -p 22,80,443 10.10.20.20   # only 22 open',
        },
        resources: [
          {
            label: 'VirtualBox — Virtual networking modes',
            url: 'https://www.virtualbox.org/manual/ch06.html',
          },
          {
            label: 'Nmap — Host discovery reference',
            url: 'https://nmap.org/book/man-host-discovery.html',
          },
          {
            label: 'Professor Messer — Network segmentation',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'What is lateral movement, and how does segmentation raise the cost of it for an attacker?',
          'What is the difference between VLAN segmentation at layer 2 and subnet segmentation at layer 3?',
          'Why must isolation be verified with ping/nmap rather than assumed from the configuration?',
        ],
        examTieIn: {
          code: '3.2',
          text: 'Given a scenario, apply security principles to secure enterprise infrastructure.',
        },
      },
      {
        id: '3.5',
        code: 'Exercise 3.5',
        title: 'Cloud Security Posture',
        xp: XP_PER_EXERCISE,
        concept: [
          'In the cloud the most common breach is not a clever exploit — it is a misconfiguration. A public S3 bucket, an over-permissive IAM policy, a security group open to 0.0.0.0/0, an unrotated access key: these are the findings that fill breach reports. Cloud Security Posture Management (CSPM) is the discipline of continuously auditing your cloud account against best practice to catch these before an attacker does.',
          'ScoutSuite and Prowler are free, open-source tools that read your account through its own APIs and produce a prioritized report of misconfigurations mapped to frameworks like the CIS Benchmarks. They are read-only assessors — they look, they do not change — which makes them safe to run against a personal account to see your real posture.',
          'The IAM findings are where SY0-701 lives: identities with more privilege than they need, missing MFA on the root account, wildcard "Action": "*" policies, and access keys that should be roles. In this lab you will run a CSPM scan against your own cloud account, read the IAM misconfigurations it surfaces, and map each to the least-privilege principle that would fix it.',
        ],
        directive: {
          intro:
            'Use a PERSONAL AWS or GCP account you own — never an employer\'s without written authorization. Create read-only credentials for the scan and delete them afterward. Stay within the free tier.',
          steps: [
            'In your own AWS/GCP account, enable a billing alarm, then create a dedicated audit identity with a read-only/security-audit policy.',
            'Install Prowler (pip install prowler) or ScoutSuite and configure it with the read-only credentials.',
            'Run the assessment and let it produce the HTML/JSON report.',
            'Open the report and filter to IAM findings: root MFA, overly permissive policies (Action/Resource wildcards), unused or old access keys, password policy gaps.',
            'Pick the top 3 IAM misconfigurations and write the least-privilege remediation for each (scope the policy, enable MFA, replace keys with roles).',
            'Delete the audit credentials when finished and note which finding posed the highest real risk and why.',
          ],
          snippet:
            '# Prowler against your own AWS account (read-only)\npip install prowler\nprowler aws --severity high critical\n\n# Common IAM findings to look for:\n#   - root account without MFA\n#   - IAM policy with \"Action\": \"*\" and \"Resource\": \"*\"\n#   - access keys older than 90 days / unused\n#   - no account password policy\n# Fix = least privilege: scope actions+resources, prefer roles over keys',
        },
        resources: [
          {
            label: 'Prowler — Open-source cloud security tool',
            url: 'https://docs.prowler.com/',
          },
          {
            label: 'ScoutSuite — Multi-cloud auditing tool',
            url: 'https://github.com/nccgroup/ScoutSuite/wiki',
          },
          {
            label: 'AWS — IAM security best practices',
            url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html',
          },
        ],
        prompts: [
          'Why are misconfigurations, not exploits, the leading cause of cloud breaches?',
          'What does an "Action": "*" / "Resource": "*" policy grant, and how does least privilege fix it?',
          'Why is a role generally preferable to a long-lived access key for granting cloud permissions?',
        ],
        examTieIn: {
          code: '3.6',
          text: 'Explain the security implications of proper hardware, software, and data asset management.',
        },
      },
      {
        id: '3.6',
        code: 'Exercise 3.6',
        title: 'PKI Chain of Trust',
        xp: XP_PER_EXERCISE,
        concept: [
          'Trust in PKI is delegated down a chain. A root Certificate Authority is the anchor — its certificate is self-signed and lives in every trust store. The root rarely signs end-entity certificates directly; instead it signs one or more intermediate CAs, and the intermediates sign the leaf (end-entity) certificates that secure actual services. This is the chain of trust: leaf → intermediate → root.',
          'The tiered design exists for security and resilience. The root\'s private key can be kept offline and almost never used, so compromising it is extremely hard; if an intermediate is compromised, it can be revoked without burning the root and reissuing every certificate on earth. Validation walks the chain upward: each certificate must be signed by the next, and the path must terminate at a trusted root.',
          'In this lab you will build all three tiers with OpenSSL — a root CA, an intermediate CA signed by the root, and an end-entity certificate signed by the intermediate — then verify the full chain with openssl verify. Watching the verification succeed only when the complete chain is present is what makes "chain of trust" concrete.',
        ],
        directive: {
          intro:
            'Pure local OpenSSL — no VM, no internet. Work in a clean directory; you will create several keys and certificates.',
          steps: [
            'Generate the ROOT CA: create its private key and a self-signed root certificate (long validity, CA:TRUE).',
            'Generate the INTERMEDIATE CA key and a CSR, then sign that CSR with the root CA to produce the intermediate certificate.',
            'Generate the END-ENTITY (server) key and CSR, then sign that CSR with the INTERMEDIATE CA — not the root.',
            'Build the chain file (intermediate + root) and verify the leaf against it with openssl verify -CAfile.',
            'Confirm the verification FAILS if you omit the intermediate, then SUCCEEDS once the full chain is supplied — proving why servers must serve their intermediate.',
            'Inspect each certificate\'s Issuer/Subject with openssl x509 -text and trace the leaf → intermediate → root linkage.',
          ],
          snippet:
            '# 1) Root CA (self-signed)\nopenssl req -x509 -newkey rsa:4096 -keyout root.key -out root.crt \\\n  -days 3650 -nodes -subj "/CN=sec-labs Root CA"\n\n# 2) Intermediate: key + CSR, signed by root\nopenssl req -newkey rsa:2048 -keyout int.key -out int.csr -nodes -subj "/CN=sec-labs Intermediate CA"\nopenssl x509 -req -in int.csr -CA root.crt -CAkey root.key -CAcreateserial -days 1825 -out int.crt\n\n# 3) End-entity: key + CSR, signed by INTERMEDIATE\nopenssl req -newkey rsa:2048 -keyout server.key -out server.csr -nodes -subj "/CN=lab.local"\nopenssl x509 -req -in server.csr -CA int.crt -CAkey int.key -CAcreateserial -days 365 -out server.crt\n\n# 4) Verify the chain\ncat int.crt root.crt > chain.pem\nopenssl verify -CAfile chain.pem server.crt        # server.crt: OK',
        },
        resources: [
          {
            label: 'OpenSSL — x509 command documentation',
            url: 'https://docs.openssl.org/master/man1/openssl-x509/',
          },
          {
            label: 'NIST SP 1800-16 — Securing certificates (TLS)',
            url: 'https://csrc.nist.gov/pubs/sp/1800/16/final',
          },
          {
            label: 'Professor Messer — Public key infrastructure',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'Why is the root CA kept offline and used to sign intermediates rather than end-entity certificates directly?',
          'What happens to trust if an intermediate CA is compromised, and how is that contained without burning the root?',
          'Why does TLS validation fail when a server omits its intermediate certificate even though the root is trusted?',
        ],
        examTieIn: {
          code: '3.9',
          text: 'Explain the importance of resilience and recovery in security architecture.',
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
      {
        id: '4.4',
        code: 'Exercise 4.4',
        title: 'SIEM Log Ingestion',
        xp: XP_PER_EXERCISE,
        concept: [
          'A detection is only as good as the data feeding it. Before a SIEM can correlate or alert, logs have to get there — collected at the source, shipped over the network (syslog is the universal lingua franca), parsed into fields, and indexed. This ingestion pipeline is unglamorous and it is where most real-world detection projects succeed or fail.',
          'Wazuh and the Elastic Stack are the two most accessible free platforms for learning this. An agent or a syslog forwarder on a monitored host pushes events to the manager; the manager normalizes them so that "user", "source IP", and "event outcome" become queryable fields rather than raw text. Once events are structured, you can write detection rules against them.',
          'The canonical first detection is failed-login brute force: many authentication failures from one source in a short window. In this lab you will forward syslog from a VM into a SIEM, confirm the events arrive and parse, and write a rule that fires on repeated failed logins — the exact signal that catches password spraying and SSH brute-forcing.',
        ],
        directive: {
          intro:
            'Run the SIEM and a monitored VM locally (Docker or VirtualBox). Wazuh\'s single-node deployment or Elastic + Filebeat both work; keep everything on an isolated network.',
          steps: [
            'Stand up Wazuh (single-node) or the Elastic Stack locally and reach its dashboard.',
            'On a separate Linux VM, configure it to forward auth logs — install the Wazuh agent, or point rsyslog/Filebeat at the manager.',
            'Generate authentication activity on the VM: a few successful logins and a burst of failed ones (wrong-password SSH attempts to yourself).',
            'In the SIEM, confirm the events arrived and are parsed into fields (user, source IP, outcome).',
            'Write or enable a detection rule: N failed authentications from the same source IP within M seconds raises an alert.',
            'Trigger the rule with a deliberate burst, confirm the alert fires, and document the rule logic and what a Tier 1 analyst does next.',
          ],
          snippet:
            '# Forward auth logs to a syslog SIEM (rsyslog example on the VM)\necho "auth,authpriv.* @@SIEM_IP:514" | sudo tee /etc/rsyslog.d/60-siem.conf\nsudo systemctl restart rsyslog\n\n# Generate failures to test (against your OWN test host)\nfor i in $(seq 1 8); do ssh baduser@localhost; done   # wrong creds\n\n# Detection logic (pseudocode):\n#   WHEN event.action = \"authentication_failure\"\n#   GROUP BY source.ip\n#   HAVING count() >= 5 WITHIN 60s  -> ALERT \"Possible brute force\"',
        },
        resources: [
          {
            label: 'Wazuh — Getting started & installation',
            url: 'https://documentation.wazuh.com/current/getting-started/index.html',
          },
          {
            label: 'Elastic — Filebeat system module',
            url: 'https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-module-system.html',
          },
          {
            label: 'Professor Messer — SIEM & log aggregation',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'Why does a SIEM need to parse logs into fields before it can correlate or alert on them?',
          'What thresholds (count and time window) make a good failed-login rule without drowning in false positives?',
          'What is the difference between log collection, aggregation, and correlation in this pipeline?',
        ],
        examTieIn: {
          code: '4.3',
          text: 'Explain various activities associated with vulnerability management.',
        },
      },
      {
        id: '4.5',
        code: 'Exercise 4.5',
        title: 'Incident Response Tabletop (NIST)',
        xp: XP_PER_EXERCISE,
        concept: [
          'A tabletop exercise pressure-tests your incident response plan with discussion instead of a real breach. The value is rehearsal: the team walks a realistic scenario through each phase, surfaces gaps in tooling and authority, and builds the muscle memory that prevents 2am improvisation. SY0-701 expects you to know the lifecycle and the decisions inside each phase.',
          'NIST frames incident response as Preparation → Detection & Analysis → Containment, Eradication & Recovery → Post-Incident Activity. Each phase has distinct goals: preparation builds the capability, detection establishes scope and severity, containment stops the bleeding while preserving evidence, eradication removes the foothold, recovery restores safely, and post-incident captures lessons learned.',
          'The hard judgment lives between phases. Containment can destroy volatile evidence, so you preserve memory, logs, and disk images with documented chain of custody first. Notification timing — legal, regulators, customers — is phase-aware, not an afterthought. In this lab you will run a ransomware scenario through every NIST phase and write what you do, decide, and preserve at each step.',
        ],
        directive: {
          intro:
            'Pure written exercise — no tools. Scenario: an employee reports their files are encrypted with a ransom note; an EDR alert shows the same on two file servers. You are the IR lead. Produce a phase-by-phase runbook.',
          steps: [
            'Prepare: list the capabilities you are relying on (tested backups, IR contacts, comms plan, logging, legal retainer) and confirm they exist.',
            'Detect & Analyze: how you confirm scope and severity — which hosts, which data, the initial access vector — and how you declare an incident.',
            'Contain: short-term isolation steps, and exactly what evidence (memory, disk image, logs) you preserve with chain of custody BEFORE pulling anything offline.',
            'Eradicate: how you remove persistence, reset credentials, close the entry vector, and confirm the actor is truly gone.',
            'Recover: how you restore from known-good backups, validate integrity, monitor for reinfection, and make the go/no-go to reconnect.',
            'Post-Incident: the after-action review, metrics, and plan updates — and state exactly when legal/compliance and any regulators get notified.',
          ],
          snippet:
            '# NIST IR lifecycle runbook skeleton\nPreparation            -> backups verified? contacts? comms? logging?\nDetection & Analysis   -> scope, severity, entry vector, declare incident\nContainment            -> PRESERVE first (memory/disk/logs + chain of custody)\n                          then isolate (segment, disable accounts)\nEradication            -> remove persistence, reset creds, patch vector\nRecovery               -> restore known-good, validate, monitor, go/no-go\nPost-Incident Activity -> AAR, metrics, plan updates, notifications',
        },
        resources: [
          {
            label: 'NIST SP 800-61r3 — Incident response recommendations',
            url: 'https://csrc.nist.gov/pubs/sp/800/61/r3/final',
          },
          {
            label: 'CISA — Tabletop exercise packages',
            url: 'https://www.cisa.gov/resources-tools/services/cisa-tabletop-exercise-packages',
          },
          {
            label: 'Professor Messer — Incident response',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'What evidence must be preserved before containment, and why can containment destroy it?',
          'How do the NIST phases differ from the PICERL model, and what maps to what?',
          'At what point do you notify legal/regulators, and what determines whether a breach-notification clock starts?',
        ],
        examTieIn: {
          code: '4.8',
          text: 'Explain appropriate incident response activities.',
        },
      },
      {
        id: '4.6',
        code: 'Exercise 4.6',
        title: 'Threat Hunting with OSINT',
        xp: XP_PER_EXERCISE,
        concept: [
          'Threat hunting and attack-surface management both start with the same question an adversary asks first: what is exposed? Open-source intelligence (OSINT) lets you answer it from public data — search engines for internet-connected devices, certificate transparency logs, passive DNS, and reputation databases — without ever touching the target intrusively.',
          'Shodan and Censys continuously scan the internet and index what they find: open ports, service banners, software versions, expired certificates, exposed databases and dashboards. VirusTotal aggregates reputation and detection data for domains, IPs, and files. Together they let a defender see their own organization the way an attacker does, and spot the forgotten dev server or unpatched service before it becomes the entry point.',
          'The discipline — and the ethics — is to profile only assets you own or are authorized to assess. In this lab you will use these passive sources against a domain you control to enumerate its exposed services, surface any risky findings (open admin panels, stale certs, flagged indicators), and turn the results into a short remediation list.',
        ],
        directive: {
          intro:
            'Authorization is mandatory: profile only a domain/IP you own or have written permission to assess. These are passive lookups — do not actively scan third parties.',
          steps: [
            'Pick a domain you own. In Shodan, search for its IP/hostname and record open ports, service banners, and software versions.',
            'In Censys, review the certificates and services for the same asset; check certificate transparency for subdomains you forgot existed.',
            'In VirusTotal, look up the domain/IP and note any detections, related files, or flagged communicating samples.',
            'Compile the exposed attack surface: each service, its version, and whether it should be internet-facing at all.',
            'Flag the risky findings — exposed admin/login panels, outdated or expired TLS, default services — and rate each by exposure.',
            'Write a short remediation list: close, firewall, patch, or move behind a VPN, and identify your single highest-priority fix.',
          ],
          snippet:
            '# Passive OSINT profiling (assets you OWN only)\n# Shodan:   https://www.shodan.io/   search:  hostname:your-domain.com\n#           note: port:, product:, version:, ssl.cert.expired:true\n# Censys:   https://search.censys.io/  -> services + certificates + subdomains\n# crt.sh:   https://crt.sh/?q=your-domain.com   (cert transparency = subdomains)\n# VirusTotal: https://www.virustotal.com/  -> domain/IP reputation + relations\n#\n# Output: service | version | should-be-public? | risk | remediation',
        },
        resources: [
          {
            label: 'Shodan — Search engine for the internet',
            url: 'https://www.shodan.io/',
          },
          {
            label: 'Censys Search',
            url: 'https://search.censys.io/',
          },
          {
            label: 'VirusTotal',
            url: 'https://www.virustotal.com/',
          },
        ],
        prompts: [
          'What is the difference between passive OSINT and active scanning, and why does the distinction matter legally?',
          'Which exposed services most often become an initial-access vector, and how would you reduce that exposure?',
          'How does certificate transparency help you discover forgotten or shadow IT assets?',
        ],
        examTieIn: {
          code: '4.5',
          text: 'Explain the purpose of threat intelligence and threat hunting activities.',
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
      {
        id: '5.4',
        code: 'Exercise 5.4',
        title: 'Risk Register Build',
        xp: XP_PER_EXERCISE,
        concept: [
          'A risk register is the working document of a security program — the single place where risks are recorded, scored, owned, and tracked to closure. It turns vague anxiety ("we might get hacked") into a ranked, fundable list of specific risks the organization can actually act on. Every mature program has one, and SY0-701 expects you to know its anatomy.',
          'The core columns encode a simple model: a threat exploiting a vulnerability against an asset, scored by likelihood and impact. Risk score is typically likelihood × impact, which lets you rank dissimilar risks on one scale. Each risk gets a treatment (mitigate, transfer, avoid, accept) and a control, and what remains after the control is applied is residual risk — the number leadership actually signs off on against the organization\'s risk appetite.',
          'In this lab you will build a real register with at least eight entries for a small fictional organization. Forcing yourself to assign concrete likelihood and impact numbers, compute scores, choose treatments, and state residual risk is the exact reasoning a GRC analyst performs — and it makes the abstract risk vocabulary stick.',
        ],
        directive: {
          intro:
            'No tools beyond a spreadsheet (Google Sheets, Excel, or LibreOffice Calc). Pick a small fictional organization and build the register with at least 8 rows.',
          steps: [
            'Choose a fictional org (dental practice, e-commerce startup, accounting firm) and write two sentences on what it does and the data it holds.',
            'Create columns: ID, Asset, Threat, Vulnerability, Likelihood (1–5), Impact (1–5), Risk Score (L×I), Treatment, Control, Residual Risk, Owner.',
            'Enter at least 8 realistic risks (ransomware, lost laptop, insider error, phishing, vendor outage, unpatched server, weak backups, exposed cloud bucket).',
            'Score likelihood and impact for each, compute Risk Score = L×I, and sort the register descending by score.',
            'Assign a treatment (mitigate/transfer/avoid/accept) and one concrete control per risk, then estimate residual risk after that control.',
            'Highlight your top 3 risks and write one sentence each on why they rank where they do and who owns them.',
          ],
          snippet:
            '# Risk register columns\nID | Asset | Threat | Vulnerability | Likelihood(1-5) | Impact(1-5) | Score | Treatment | Control | Residual | Owner\n\n# Example rows\nR1 | File server | Ransomware | Unpatched RDP exposed | 4 | 5 | 20 | Mitigate | Patch+offline backups+MFA | Low  | IT Lead\nR2 | Laptops     | Theft/loss | No disk encryption     | 3 | 4 | 12 | Mitigate | BitLocker + remote wipe   | Low  | IT Lead\nR3 | Customer DB | Insider error | Over-broad access    | 2 | 5 | 10 | Mitigate | Least privilege + logging | Med  | DBA',
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
          'Why is Risk Score = Likelihood × Impact useful for ranking risks that are otherwise hard to compare?',
          'What is residual risk, and who in the organization should formally accept it?',
          'Give one risk from your register best handled by transfer rather than mitigation, and explain why.',
        ],
        examTieIn: {
          code: '5.2',
          text: 'Explain elements of the risk management process.',
        },
      },
      {
        id: '5.5',
        code: 'Exercise 5.5',
        title: 'Compliance Gap Analysis',
        xp: XP_PER_EXERCISE,
        concept: [
          'A gap analysis measures the distance between where your security program is and where a standard says it should be. You take an authoritative control set, assess your current state against each control, and the deltas — the missing or partial controls — are your gaps. The output is a prioritized remediation roadmap, which is exactly what auditors, boards, and cyber-insurers want to see.',
          'The CIS Controls v8 are a free, prioritized set of safeguards organized into Implementation Groups. IG1 is the baseline of essential cyber hygiene every organization should meet — asset inventory, access control, secure configuration, backups, malware defenses, awareness training. It is deliberately achievable, which makes it the perfect yardstick for a home lab or a small organization.',
          'In this lab you will assess your home lab (or a fictional small org) against CIS Controls v8 IG1, mark each safeguard as met / partial / not met, identify the gaps, and propose a concrete remediation for each. This is the same control-mapping reasoning SY0-701 tests under compliance and audit.',
        ],
        directive: {
          intro:
            'No special tools — download the free CIS Controls v8 and use a spreadsheet. Assess your own home lab or a fictional small organization against Implementation Group 1.',
          steps: [
            'Download CIS Controls v8 and identify the IG1 safeguards (the baseline subset).',
            'List your environment\'s assets and current controls so you have an honest current-state picture.',
            'Go safeguard by safeguard through a representative set of IG1 controls (inventory, access control, secure config, continuous vuln management, audit logs, malware defenses, backups, awareness).',
            'Mark each as Met / Partial / Not Met with a one-line note of evidence.',
            'For every gap (Partial/Not Met), write a specific, prioritized remediation and a rough effort estimate.',
            'Summarize: your IG1 coverage percentage and the top 3 remediations you would do first, with justification.',
          ],
          snippet:
            '# Gap analysis worksheet (CIS Controls v8, IG1)\nControl | Safeguard | Current State | Met/Partial/Not | Gap | Remediation | Priority\n1  Inventory of Enterprise Assets | maintain asset inventory | ad-hoc list | Partial | no auto-discovery | deploy inventory tool | High\n5  Account Management            | unique accounts, no shared | shared admin used | Not Met | shared creds | per-user accounts + MFA | High\n11 Data Recovery                  | automated tested backups   | manual, untested | Partial | no restore test | schedule + test restores | High',
        },
        resources: [
          {
            label: 'CIS Controls v8 (free download)',
            url: 'https://www.cisecurity.org/controls/v8',
          },
          {
            label: 'CIS — Implementation Groups explained',
            url: 'https://www.cisecurity.org/controls/implementation-groups',
          },
          {
            label: 'Professor Messer — Compliance & audits',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'What is the purpose of a gap analysis, and how does it turn a standard into an action plan?',
          'Why does CIS define Implementation Groups, and what makes IG1 the right baseline for a small organization?',
          'How would you prioritize remediations when you cannot close every gap at once?',
        ],
        examTieIn: {
          code: '5.6',
          text: 'Given a scenario, implement security governance, risk, and compliance concepts.',
        },
      },
      {
        id: '5.6',
        code: 'Exercise 5.6',
        title: 'Security Awareness Program Design',
        xp: XP_PER_EXERCISE,
        concept: [
          'People are the control that the most expensive firewall cannot replace. A security awareness program exists to change behavior — to make reporting a suspicious email reflexive, strong unique passwords normal, tailgating socially unacceptable, and "see something, say something" part of the culture. A once-a-year video is compliance theater; real awareness is continuous, relevant, and reinforced.',
          'SY0-701 expects you to cover the core topics: phishing and social engineering, password hygiene and MFA, physical security (tailgating, clean desk, badge discipline), and incident reporting (what to report and to whom, fast). The best programs deliver these in small, role-relevant doses and reinforce them with simulations, then measure the result — click rate down, report rate up.',
          'In this lab you will design and build a four-slide security awareness deck — one slide per core topic — that a security lead could actually present. Producing the deck forces you to distill each topic into the few behaviors that matter most, which is both a teaching skill and an exam-relevant exercise in what awareness programs must contain.',
        ],
        directive: {
          intro:
            'Use any free presentation tool: Google Slides, LibreOffice Impress, or PowerPoint. Deliverable is a focused 4-slide deck, one slide per topic, aimed at non-technical staff.',
          steps: [
            'Slide 1 — Phishing & social engineering: the top 3 red flags and the one action (report via the button, do not click).',
            'Slide 2 — Password hygiene & MFA: unique passwords, a password manager, and why MFA stops stolen passwords.',
            'Slide 3 — Physical security: tailgating, clean-desk, badge discipline, and locking screens.',
            'Slide 4 — Incident reporting: what counts as an incident, exactly who to contact, and why fast reporting limits damage.',
            'Keep each slide to one clear behavior change and plain language — write for a non-technical audience, not for IT.',
            'Add a closing note on how you would measure the program (phishing click rate, report rate, completion %) and how often you would refresh it.',
          ],
          snippet:
            '# 4-slide awareness deck outline\nSlide 1  Phishing       -> 3 red flags + "Report, don\'t click"\nSlide 2  Passwords/MFA  -> unique passwords, password manager, MFA everywhere\nSlide 3  Physical       -> no tailgating, clean desk, lock your screen, badge in\nSlide 4  Reporting      -> what to report, who to call, report FAST\n\n# Effectiveness metrics (put on a closing slide)\n#   phishing click rate (down) | report rate (up) | completion % | time-to-report',
        },
        resources: [
          {
            label: 'NIST SP 800-50r1 — Security awareness & training',
            url: 'https://csrc.nist.gov/pubs/sp/800/50/r1/final',
          },
          {
            label: 'CISA — Cybersecurity awareness resources',
            url: 'https://www.cisa.gov/cybersecurity-awareness-month',
          },
          {
            label: 'Professor Messer — Security awareness',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-training-course/',
          },
        ],
        prompts: [
          'What separates an awareness program that changes behavior from one that is checkbox compliance?',
          'Which four topics are non-negotiable in a baseline awareness program, and why each?',
          'What metrics prove an awareness program is working, and how would you present them to leadership?',
        ],
        examTieIn: {
          code: '5.5',
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

export const TOTAL_EXERCISES = allExercises.length // 30

export function getDomain(id) {
  return domains.find((d) => d.id === String(id))
}

export function getExercise(domainId, exerciseId) {
  const domain = getDomain(domainId)
  if (!domain) return null
  return domain.exercises.find((ex) => ex.id === String(exerciseId)) || null
}
