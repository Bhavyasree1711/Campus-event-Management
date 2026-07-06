import os

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace texts
    content = content.replace('KUPPAM EDUCATIONAL SOCIETY', 'GLOBAL TECH UNIVERSITY')
    content = content.replace('Kuppam Engineering College,<br>KES Nagar, Kuppam, Chittoor Dist,<br>AP 517425.', 'Global Tech Campus,<br>123 Innovation Drive, Silicon Valley,<br>CA 94025.')
    content = content.replace('mail@kec.ac.in', 'info@globaltech.edu')
    content = content.replace('principal@kec.ac.in', 'admin@globaltech.edu')
    content = content.replace('+91 85702 56966', '+1 (555) 123-4567')
    content = content.replace('+91 93938 12267', '+1 (555) 987-6543')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated {file}')
