import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
footer_html = """    <!-- Footer -->
    <footer class="custom-footer mt-auto py-5">
        <div class="container">
            <div class="row g-4">
                <!-- Left Column -->
                <div class="col-lg-6">
                    <div class="d-flex align-items-center mb-4">
                        <i class="bi bi-mortarboard-fill fs-1 text-primary me-3 bg-white rounded-circle p-2"></i>
                        <h4 class="fw-bold mb-0 text-white">KUPPAM EDUCATIONAL SOCIETY</h4>
                    </div>
                    
                    <ul class="list-unstyled footer-contact">
                        <li class="mb-3 d-flex">
                            <i class="bi bi-geo-alt-fill me-3 mt-1"></i>
                            <div>Kuppam Engineering College,<br>KES Nagar, Kuppam, Chittoor Dist,<br>AP 517425.</div>
                        </li>
                        <li class="mb-3"><i class="bi bi-envelope-fill me-3"></i> mail@kec.ac.in</li>
                        <li class="mb-3"><i class="bi bi-envelope-fill me-3"></i> principal@kec.ac.in</li>
                        <li class="mb-3"><i class="bi bi-telephone-fill me-3"></i> +91 85702 56966</li>
                        <li><i class="bi bi-telephone-fill me-3"></i> +91 93938 12267</li>
                    </ul>
                </div>
                
                <!-- Right Column -->
                <div class="col-lg-6">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="fw-bold text-white mb-0">Follow Us</h5>
                        <div class="d-flex gap-3">
                            <a href="#" class="text-white fs-4 hover-primary"><i class="bi bi-facebook"></i></a>
                            <a href="#" class="text-white fs-4 hover-primary"><i class="bi bi-youtube"></i></a>
                            <a href="#" class="text-white fs-4 hover-primary"><i class="bi bi-instagram"></i></a>
                            <a href="#" class="text-white fs-4 hover-primary"><i class="bi bi-twitter-x"></i></a>
                        </div>
                    </div>
                    
                    <h6 class="fw-bold text-white mb-3 text-uppercase mt-4">Newsletter</h6>
                    <form class="d-flex mb-4" onsubmit="event.preventDefault();">
                        <input type="email" class="form-control rounded-0 border-0 bg-secondary bg-opacity-25 text-white shadow-none" placeholder="Your email here" required style="max-width: 300px;">
                        <button type="submit" class="btn btn-danger rounded-0 px-4"><i class="bi bi-chevron-right"></i></button>
                    </form>
                    
                    <h6 class="fw-bold text-danger mb-3 text-uppercase">Anti Ragging</h6>
                    <ul class="list-unstyled footer-contact">
                        <li class="mb-2"><i class="bi bi-telephone-fill me-3 text-danger"></i> 1800 180 5522</li>
                        <li><i class="bi bi-envelope-fill me-3 text-danger"></i> helpline@antiragging.in</li>
                    </ul>
                </div>
            </div>
            
            <hr class="border-secondary mt-5 mb-4">
            
            <div class="text-center pb-2">
                <p class="mb-1 text-white-50">&copy; 2026 College Event Management System. All rights reserved.</p>
                <p class="mb-0 text-white-50 small">Developed by S.Bhaya Sree</p>
            </div>
        </div>
    </footer>"""

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the existing footer with the new one
    new_content = re.sub(r'<footer.*?</footer>', footer_html.strip(), content, flags=re.DOTALL)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f'Updated {file}')
