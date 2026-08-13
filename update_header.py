import os
import re

html_dir = r"d:\Projects\Econiya-git\Econiya"

old_pattern = re.compile(r'<li class="nav-item">\s*<a class="nav-link" href="about\.html">About Us</a>\s*</li>', re.MULTILINE)

new_html = """<li class="nav-item dropdown has-mega-menu">
                      <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">About Us</a>
                      <div class="dropdown-menu mega-menu">
                        <div class="mega-menu-inner">
                          <div class="row g-4">
                            <!-- Left Column -->
                            <div class="col-lg-6 mega-menu-col">
                              <a href="about.html" class="mega-menu-item">
                                <div class="icon-box"><i class="bi bi-info-circle"></i></div>
                                <div class="text-box">
                                  <h6>Who We Are</h6>
                                  <p>Our Story, Expertise & Commitment</p>
                                </div>
                              </a>
                              <a href="our-team.html" class="mega-menu-item">
                                <div class="icon-box"><i class="bi bi-people"></i></div>
                                <div class="text-box">
                                  <h6>Our Team</h6>
                                  <p>Meet the people behind Econiya's success.</p>
                                </div>
                              </a>
                              <a href="employee-speaks.html" class="mega-menu-item">
                                <div class="icon-box"><i class="bi bi-play-circle"></i></div>
                                <div class="text-box">
                                  <h6>Employee Speaks</h6>
                                  <p>Team voices, experiences, and stories.</p>
                                </div>
                              </a>
                            </div>
                            <!-- Right Column -->
                            <div class="col-lg-6 mega-menu-col">
                              <a href="client-testimonials.html" class="mega-menu-item">
                                <div class="icon-box"><i class="bi bi-chat-dots"></i></div>
                                <div class="text-box">
                                  <h6>Client Testimonials</h6>
                                  <p>Proven results, lasting partnerships.</p>
                                </div>
                              </a>
                              <a href="careers.html" class="mega-menu-item">
                                <div class="icon-box"><i class="bi bi-briefcase"></i></div>
                                <div class="text-box">
                                  <h6>Careers</h6>
                                  <p>Build your future with us.</p>
                                </div>
                              </a>
                              <a href="infrastructure.html" class="mega-menu-item">
                                <div class="icon-box"><i class="bi bi-building"></i></div>
                                <div class="text-box">
                                  <h6>Infrastructure</h6>
                                  <p>Advanced facilities, smarter technology.</p>
                                </div>
                              </a>
                            </div>
                          </div>
                          
                          <!-- CTA Block -->
                          <div class="mega-menu-cta">
                            <div class="cta-text">
                              <h4>Explore Our <span>Company Profile</span></h4>
                              <p>Discover our expertise, capabilities, and engineering excellence.</p>
                            </div>
                            <a href="#" class="btn btn-primary cta-btn">Download Profile <i class="bi bi-file-earmark-pdf"></i></a>
                          </div>
                        </div>
                      </div>
                    </li>"""

count = 0
for filename in os.listdir(html_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(html_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content, num_subs = old_pattern.subn(new_html, content)
        
        if num_subs > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1
            print(f"Updated {filename}")

print(f"Total updated: {count}")
