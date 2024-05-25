document.addEventListener("DOMContentLoaded", function() {
    var images = document.querySelectorAll(".image-container img");

    setInterval(function() {
        images.forEach(function(image) {
            //Oculta la imagen
            image.style.display = "none";
        });

        images[index].style.display = "block";

        index = (index + 1) % images.length;
    }, 2000); // Cambia la imagen cada 2 segundos
});
