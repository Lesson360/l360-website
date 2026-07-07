# Implementation Plan: Production-Ready White-Label Portal

This plan details the technical steps to move the White-Label feature from a local mockup/simulation state to a fully secure, automated, and production-ready system.

---

## Technical Goals
1. **Real-time DNS Propagation Checks**: Replace client-side mockup verification with a secure Node.js backend endpoint query using standard DNS TXT record lookups.
2. **Dynamic File Uploads for Branding**: Enable direct logo and favicon file uploads into a secure Supabase storage bucket (`branding-assets`) with path constraints matching the workspace ID.
3. **Automated SSL & Hosting Integration (Vercel API)**: When a custom domain is verified, automatically register the domain with our Next.js hosting platform (Vercel Domains API) to trigger SSL certificate generation and routing configurations.
4. **Dynamic Next.js Server-Side Metadata (SEO & Icons)**: Inject custom brand titles and favicon configurations server-side during the route generation phase using `generateMetadata`, ensuring fast page load times and correct bookmark icons.
5. **Dynamic Color Shade Generation**: Update color custom variables context to automatically calculate lighter/darker shades of hex colors for button hover, active, and outline focus rings.

---

## Proposed Changes

### 1. Storage Configuration (Supabase)
#### [NEW] Database Migration & Bucket Rules
* Set up a public storage bucket `branding-assets` in Supabase with the following Row Level Security (RLS) rules:
  - **Read**: Publicly readable (anyone can load logo/favicon assets).
  - **Insert/Update/Delete**: Restrict to authenticated users whose profile `workspace_id` matches the storage directory path (`/workspace_id/*`).

---

### 2. Branding Asset Upload
#### [MODIFY] settings/white-label/page.tsx
- Replace simple text inputs for `logo_url` and `favicon_url` with interactive file uploader components.
- Handle upload using the Supabase storage SDK:
  ```typescript
  const uploadAsset = async (file: File, type: 'logo' | 'favicon') => {
    const fileExt = file.name.split('.').pop()
    const path = `${currentWorkspace.id}/${type}.${fileExt}`
    const { data, error } = await supabase.storage.from('branding-assets').upload(path, file, { upsert: true })
    if (error) throw error
    const { data: publicUrlData } = supabase.storage.from('branding-assets').getPublicUrl(path)
    return publicUrlData.publicUrl
  }
  ```
- Automatically write the resolved public URLs back to the workspace's `branding` JSON column on submit.

---

### 3. Backend DNS Validation & Vercel SSL Provisioning
#### [NEW] [route.ts](file:///c:/Users/hp/Documents/hawkish_group/biztalk-platform/apps/web/src/app/api/settings/domains/verify/route.ts)
- Create a backend API route to query DNS propagation checks:
  - Input parameters: `workspaceId` and `domain`.
  - Check that the domain belongs to the calling user's workspace.
  - Query DNS TXT entries for `_biztalk-verify.${domain}` using Node's `dns` module:
    ```typescript
    import dns from 'dns/promises'
    // ...
    const records = await dns.resolveTxt(`_biztalk-verify.${domain}`)
    const matchesToken = records.some(record => record.includes(verificationToken))
    ```
  - If verified, update `workspace_domains` to `verified: true` and the `workspaces` table `custom_domain` property.
  - **Vercel API Integration**: Trigger a POST request to Vercel Domains endpoint to request certificate generation and map hostname:
    ```typescript
    const res = await fetch(`https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    })
    ```

---

### 4. Dynamic SEO Metadata & Server Headers
#### [MODIFY] [layout.tsx](/portal/[subdomain]/layout.tsx)(file:///c:/Users/hp/Documents/hawkish_group/biztalk-platform/apps/web/src/app/portal/%5Bsubdomain%5D/layout.tsx)
- Implement dynamic layout metadata using Next.js `generateMetadata` callback:
  ```typescript
  import { createClient } from '@/lib/supabase/server'

  export async function generateMetadata({ params }: { params: { subdomain: string } }) {
    const supabase = createClient()
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('name, branding, custom_domain')
      .or(`subdomain.eq.${params.subdomain},custom_domain.eq.${params.subdomain}`)
      .single()

    const branding = workspace?.branding
    return {
      title: branding?.business_name || workspace?.name || 'Client Portal',
      icons: {
        icon: branding?.favicon_url || '/favicon.ico',
        apple: branding?.logo_url || '/apple-touch-icon.png',
      }
    }
  }
  ```

---

### 5. Color Shade Computations
#### [MODIFY] [BrandingContext.tsx](file:///c:/Users/hp/Documents/hawkish_group/biztalk-platform/apps/web/src/contexts/BrandingContext.tsx)
- Add utility helpers to generate dark/light variations of custom branding hex inputs:
  ```typescript
  const adjustColor = (hex: string, percent: number): string => {
    let R = parseInt(hex.substring(1, 3), 16)
    let G = parseInt(hex.substring(3, 5), 16)
    let B = parseInt(hex.substring(5, 7), 16)

    R = parseInt(((R * (100 + percent)) / 100).toString())
    G = parseInt(((G * (100 + percent)) / 100).toString())
    B = parseInt(((B * (100 + percent)) / 100).toString())

    R = R < 255 ? R : 255
    G = G < 255 ? G : 255
    B = B < 255 ? B : 255

    const rHex = R.toString(16).padStart(2, '0')
    const gHex = G.toString(16).padStart(2, '0')
    const bHex = B.toString(16).padStart(2, '0')

    return `#${rHex}${gHex}${bHex}`
  }
  ```
- Expose the shades as dynamic CSS properties:
  - `--brand-primary-hover` (adjustColor(primary, -12))
  - `--brand-primary-light` (adjustColor(primary, 40))
  - `--brand-accent-hover` (adjustColor(accent, -10))

---

## Verification Plan

### 1. Verification Setup
- Mock DNS responses during local development using environment overrides.
- Provide a CLI mock tool or test cases to simulate DNS verification cycles.

### 2. Manual Verification
- Test file uploads of PNG/ICO formats in the settings view, checking that public URLs generate correctly.
- Verify color shade generation by hovering over UI buttons on the portal page and checking focus borders.
- Test server-rendered bookmark icons and titles on the workspace URL paths.
