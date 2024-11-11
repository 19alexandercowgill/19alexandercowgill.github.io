document.querySelectorAll("#contents li").forEach((li) => {
  li.addEventListener("mousedown", function (event) {
    const url = li.getAttribute("data-href");
    if (url) {
      // Left click (button 0)
      if (event.button === 0) {
        window.location.href = url;
      }
      // Middle click (button 1)
      else if (event.button === 1) {
        window.open(url, "_blank");
      }
      // Right click (button 2)
      else if (event.button === 2) {
        // Handle right-click if needed
        console.log("Right-click detected");
      }
    }
  });

  // Prevent the default right-click context menu
  li.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });
});
