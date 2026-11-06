# Profile badges

These three static badges preserve the LinkedIn and AWS logos without depending
on the current Shields logo catalog. The `linkedin` and `amazonaws` names returned
badges without icons when checked on 2026-11-06.

The SVGs use the existing flat-square style, labels and colors. Their white logos
are embedded SVG data, so browsers do not need another request to load the artwork.
The two `live` labels are static links, as before; the README's **Production status**
badges perform the actual availability checks. npm versions and GitHub releases
also remain dynamic.

## Sources and maintenance

Artwork comes from [Simple Icons v11.15.0](https://github.com/simple-icons/simple-icons/tree/11.15.0)
([CC0 license](https://github.com/simple-icons/simple-icons/blob/11.15.0/LICENSE.md)):

- [LinkedIn](https://cdn.jsdelivr.net/npm/simple-icons@11.15.0/icons/linkedin.svg)
- [Amazon AWS](https://cdn.jsdelivr.net/npm/simple-icons@11.15.0/icons/amazonaws.svg)

To regenerate, set the source SVG path fill to `#fff`, base64-encode the SVG and
pass it as a URL-encoded `logo=data:image/svg+xml;base64,...` parameter to the
[Shields custom-logo API](https://shields.io/docs/logos). Use these static badges:

| File | Shields badge path | Style |
| :-- | :-- | :-- |
| `linkedin.svg` | `/badge/LinkedIn-Jaden_Razo-0a66c2` | `flat-square` |
| `raizhost-live.svg` | `/badge/raizhost.com-live-2ea043` | `flat-square` |
| `llm-live.svg` | `/badge/llm.raizhost.com-live-2ea043` | `flat-square` |

Save the response here and visually check its text and logo before committing.
Do not snapshot dynamic version or availability badges: that would freeze their data.
