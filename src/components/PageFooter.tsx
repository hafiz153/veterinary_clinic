import { useState, useEffect } from "react";

export default function PageFooter() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const timer = setInterval(() => {
      setYear(new Date().getFullYear());
    }, 1000); // optional if you want it to update automatically

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="mt-8 border-t border-gray-200 py-4 text-center text-gray-600">
      <p>
        &copy; {year} VetClinic. All rights reserved.
      </p>
      <p className="mt-1 text-sm">
        Developed by <span className="font-semibold">Md Hafizul Islam</span>
      </p>
      <div className="flex justify-center gap-4 mt-2">
        <a href="#" className="hover:text-primary-600">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-primary-600">
          Terms of Service
        </a>
        <a href="#" className="hover:text-primary-600">
          Contact
        </a>
      </div>
    </footer>
  );
}
