import os

CHAT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "chat"))

def load_file(filename: str) -> str:
    path = os.path.join(CHAT_DIR, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return ""

def load_markdown_for_page(page: str) -> str:
    # Always load personality.md
    personality = load_file("personality.md")
    content = ""
    
    if page == "project-renewly":
        content += load_file("Renewly/project.md") + "\n\n"
        content += load_file("Renewly/faq.md") + "\n\n"
    elif page == "project-ciphercare":
        content += load_file("CipherCare/project.md") + "\n\n"
        content += load_file("CipherCare/faq.md") + "\n\n"
    elif page == "project-pothole":
        content += load_file("Pothole/project.md") + "\n\n"
        content += load_file("Pothole/faq.md") + "\n\n"
    elif page == "project-fare-calculator":
        content += load_file("FareCalculator/project.md") + "\n\n"
        content += load_file("FareCalculator/faq.md") + "\n\n"
    elif page == "research-stackelberg":
        content += load_file("Stackelberg/project.md") + "\n\n"
        content += load_file("Stackelberg/faq.md") + "\n\n"
    elif page == "resume":
        content += load_file("resume.md") + "\n\n"
    elif page == "skills":
        content += load_file("skills.md") + "\n\n"
    elif page == "contact":
        content += load_file("contact.md") + "\n\n"
    else:
        # Default or 'about' context
        content += load_file("about.md") + "\n\n"
        content += load_file("faq.md") + "\n\n"
        content += load_file("resume.md") + "\n\n"
        
    return f"{personality}\n\n{content}"
