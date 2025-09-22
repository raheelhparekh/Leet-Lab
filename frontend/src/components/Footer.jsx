import React from "react";
import { Github, Twitter, Linkedin, Mail, Code, Heart } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-base-200 text-base-content mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-bold">LeetLab</span>
            </div>
            <p className="text-base-content/70 mb-4 max-w-md">
              A platform inspired by LeetCode that helps you prepare for coding interviews 
              and improve your programming skills by solving challenging problems.
            </p>
            <div className="flex gap-4">
              <a href="#" className="btn btn-ghost btn-circle btn-sm">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="btn btn-ghost btn-circle btn-sm">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="btn btn-ghost btn-circle btn-sm">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="btn btn-ghost btn-circle btn-sm">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="link link-hover">Problems</a></li>
              <li><a href="/profile" className="link link-hover">Profile</a></li>
              <li><a href="#" className="link link-hover">Leaderboard</a></li>
              <li><a href="#" className="link link-hover">Discussions</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="link link-hover">Help Center</a></li>
              <li><a href="#" className="link link-hover">Contact Us</a></li>
              <li><a href="#" className="link link-hover">Report Bug</a></li>
              <li><a href="#" className="link link-hover">Feature Request</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-base-300 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-base-content/60 text-sm">
              © 2024 LeetLab. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-base-content/60">Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span className="text-base-content/60">for developers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;