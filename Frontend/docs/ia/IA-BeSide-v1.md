# BeSide – IA & User Flows (v1)

```mermaid

---
config:
  theme: dark
  flowchart:
    curve: linear
  layout: dagre
  look: handDrawn
---
flowchart LR
    Launch["App Launch"] -- first run --> ONB["Onboarding"]
    Launch -- not first run --> AUTHQ{"Logged in?"}
    ONB -- Get Started --> AUTHQ
    AUTHQ -- No --> AUTH["Login/Register"]
    AUTHQ -- Yes --> HOME["Home Map"]
    AUTH -- Login success --> HOME
    AUTH -- Register success --> VEMAIL["Verify Email"]
    VEMAIL -- Verified --> HOME
    HOME -- Find a Companion --> VQ{"Verified account?"}
    VQ -- No --> VERIFY["Verify : WWCC/License"]
    VERIFY -- Verified --> CONSENTQ{"Trip consent?"}
    VQ -- Yes --> CONSENTQ
    CONSENTQ -- No --> CM["Consent modal"]
    CM -- Agree --> SELFIE["Selfie capture"]
    CONSENTQ -- Yes --> SELFIE
    SELFIE --> PREFS["Companion preferences"]
    PREFS --> SEARCH["Searching…"]
    SEARCH -- Cancel --> HOME
    SEARCH -- Results --> RESULTS["Results on map"]
    RESULTS -- Tap marker --> PREVIEW["Preview sheet"]
    PREVIEW -- Send Request --> REQ["Request sent : pending"]
    PREVIEW -- View Profile --> OPROFILE["Companion profile"]
    PREVIEW -- Cancel --> HOME
    REQ -- Accepted --> MATCH["Match created"]
    REQ -- Declined/Timeout --> RESULTS
    OPROFILE -- Back --> RESULTS
    HOME --> PRO["Your Profile : Edit, Visibility, Delete, Logout"] & SAFETY["Safety sheet"]
