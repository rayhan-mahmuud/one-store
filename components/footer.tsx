import { APP_NAME } from "@/lib/constants";

export default function Footer() {
  const cuurentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="p-5 flex-center">
        {cuurentYear} {APP_NAME}. All Rights Reserved
      </div>
    </footer>
  );
}
