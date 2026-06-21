"""
Convert Markdown to styled HTML, then print to PDF via Playwright Chromium.
Usage: python md-to-pdf.py <input.md> <output.pdf>
"""
import sys
import os
import markdown
from pathlib import Path

# ============================================================
# 1) HTML template with print-friendly CSS
# ============================================================
HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<style>
  @page {{
    size: A4;
    margin: 2cm 1.8cm 2.5cm 1.8cm;
    @bottom-center {{
      content: counter(page) " / " counter(pages);
      font-family: 'Helvetica', 'Arial', sans-serif;
      font-size: 9pt;
      color: #666;
    }}
    @top-right {{
      content: "Arteri E-Learning — Test Plan v1.0";
      font-family: 'Helvetica', 'Arial', sans-serif;
      font-size: 8pt;
      color: #999;
    }}
  }}

  body {{
    font-family: 'Helvetica', 'Arial', sans-serif;
    font-size: 10.5pt;
    line-height: 1.55;
    color: #1a1a1a;
    max-width: 100%;
  }}

  h1, h2, h3, h4 {{
    color: #0f172a;
    font-weight: 700;
    line-height: 1.3;
    page-break-after: avoid;
  }}
  h1 {{
    font-size: 22pt;
    border-bottom: 3px solid #2563eb;
    padding-bottom: 8px;
    margin: 0 0 18px 0;
    page-break-before: always;
  }}
  h1:first-of-type {{
    page-break-before: avoid;
  }}
  h2 {{
    font-size: 15pt;
    color: #1e40af;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 5px;
    margin: 24px 0 12px 0;
  }}
  h3 {{
    font-size: 12.5pt;
    color: #1e3a8a;
    margin: 18px 0 8px 0;
  }}
  h4 {{
    font-size: 11pt;
    color: #334155;
    margin: 14px 0 6px 0;
  }}

  p, li {{ margin: 6px 0; }}

  ul, ol {{
    padding-left: 22px;
    margin: 8px 0;
  }}
  li {{ margin: 3px 0; }}

  blockquote {{
    border-left: 4px solid #3b82f6;
    background: #f1f5f9;
    margin: 10px 0;
    padding: 8px 14px;
    color: #334155;
    font-style: italic;
    border-radius: 0 4px 4px 0;
  }}

  code {{
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 9.5pt;
    background: #f1f5f9;
    padding: 1px 5px;
    border-radius: 3px;
    color: #be185d;
  }}

  pre {{
    background: #0f172a;
    color: #e2e8f0;
    padding: 12px 14px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 9pt;
    line-height: 1.45;
    page-break-inside: avoid;
  }}
  pre code {{
    background: transparent;
    color: inherit;
    padding: 0;
  }}

  table {{
    border-collapse: collapse;
    width: 100%;
    margin: 12px 0;
    page-break-inside: avoid;
    font-size: 9.5pt;
  }}
  th, td {{
    border: 1px solid #cbd5e1;
    padding: 6px 10px;
    text-align: left;
    vertical-align: top;
  }}
  th {{
    background: #1e40af;
    color: #fff;
    font-weight: 600;
    font-size: 9.5pt;
  }}
  tr:nth-child(even) td {{
    background: #f8fafc;
  }}
  tr:hover td {{
    background: #eff6ff;
  }}

  hr {{
    border: 0;
    border-top: 1px solid #e2e8f0;
    margin: 20px 0;
  }}

  a {{
    color: #2563eb;
    text-decoration: none;
  }}

  /* Markdown extension classes */
  .task-list-item {{ list-style: none; }}
  .task-list-item input[type="checkbox"] {{ margin-right: 6px; }}

  /* Header/footer table for document info */
  .doc-info {{
    background: #f1f5f9;
    border-left: 4px solid #2563eb;
    padding: 12px 16px;
    margin: 16px 0 24px 0;
    border-radius: 0 4px 4px 0;
    page-break-inside: avoid;
  }}
  .doc-info table {{
    background: transparent;
    margin: 0;
  }}
  .doc-info th, .doc-info td {{
    background: transparent;
    border: none;
    padding: 3px 8px;
    color: #1e293b;
  }}
  .doc-info th {{
    color: #1e40af;
    width: 30%;
  }}
</style>
</head>
<body>
{body}
</body>
</html>
"""

# ============================================================
# 2) Read MD, convert to HTML
# ============================================================
if len(sys.argv) < 3:
    print(f"Usage: {sys.argv[0]} <input.md> <output.html> [output.pdf]")
    sys.exit(1)

input_md = Path(sys.argv[1])
output_html = Path(sys.argv[2])
output_pdf = Path(sys.argv[3]) if len(sys.argv) > 3 else None

md_text = input_md.read_text(encoding="utf-8")
html_body = markdown.markdown(
    md_text,
    extensions=[
        "extra",       # tables, fenced code, footnotes, etc.
        "codehilite",  # syntax highlighting
        "toc",         # table of contents
        "sane_lists",  # better list handling
    ],
    extension_configs={
        "codehilite": {"css_class": "codehilite", "guess_lang": False}
    }
)

# Wrap first table (Document Information) with doc-info class for styling
html_body = html_body.replace(
    '<table>',
    '<table class="doc-info">',
    1  # only first table
)

full_html = HTML_TEMPLATE.format(
    title=input_md.stem,
    body=html_body
)

output_html.write_text(full_html, encoding="utf-8")
print(f"✓ HTML written: {output_html} ({len(full_html):,} bytes)")

# ============================================================
# 3) Print HTML to PDF via Playwright Chromium
# ============================================================
if output_pdf:
    import subprocess
    chrome_path = os.path.expanduser(
        "~/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome"
    )
    if not os.path.exists(chrome_path):
        print(f"✗ Chromium not found at {chrome_path}")
        sys.exit(1)

    cmd = [
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        f"--print-to-pdf={output_pdf}",
        "--no-pdf-header-footer",  # we use @page CSS for header/footer
        f"file://{output_html.absolute()}",
    ]
    print(f"→ Printing to PDF: {output_pdf}")
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    if r.returncode == 0 and output_pdf.exists():
        size_kb = output_pdf.stat().st_size / 1024
        print(f"✓ PDF written: {output_pdf} ({size_kb:.1f} KB)")
    else:
        print(f"✗ Chromium failed: rc={r.returncode}")
        print(r.stderr[:500])
