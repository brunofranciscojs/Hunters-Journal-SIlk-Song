import { useEffect } from "react";

export default function ConveyThis() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.conveythis.com/javascript/conveythis.js";
    script.async = true;
    script.onload = () => {
      if (window.ConveyThis_Initializer) {
        window.ConveyThis_Initializer.init({
          api_key: "pub_c80410c08aaf291459e210300fb30cb8"
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return null; // não renderiza nada
}
