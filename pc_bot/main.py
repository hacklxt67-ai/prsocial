import sys
import os

# Ensure package path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pc_bot.gui import PRSocialApp

def main():
    app = PRSocialApp()
    app.mainloop()

if __name__ == "__main__":
    main()
