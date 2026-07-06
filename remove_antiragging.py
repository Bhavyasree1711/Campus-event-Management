import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# The anti ragging HTML block
anti_ragging_regex = r'<h6 class="fw-bold text-danger mb-3 text-uppercase(\s*mt-4)?">Anti Ragging</h6>\s*<ul class="list-unstyled footer-contact">\s*<li class="mb-2"><i class="bi bi-telephone-fill me-3 text-danger"></i> 1800 180 5522</li>\s*<li><i class="bi bi-envelope-fill me-3 text-danger"></i> helpline@antiragging.in</li>\s*</ul>'

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove the anti ragging section
    new_content = re.sub(anti_ragging_regex, '', content, flags=re.DOTALL)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Removed anti ragging from {file}')

# Also fix style.css hero-overlay opacity
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

css = css.replace('rgba(15, 23, 42, 0.9)', 'rgba(15, 23, 42, 0.6)')
css = css.replace('rgba(79, 70, 229, 0.7)', 'rgba(79, 70, 229, 0.4)')

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)
print('Updated CSS hero-overlay opacity')
