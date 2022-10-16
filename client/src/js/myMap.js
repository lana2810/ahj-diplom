export default function userMap(coord) {
  const body = document.querySelector("body");
  const divMaps = document.createElement("div");
  divMaps.id = "maps";
  divMaps.style.width = "600px";
  divMaps.style.height = "400px";
  divMaps.classList.add("popup");

  const iconDelete = document.createElement("i");
  iconDelete.classList.add("fa", "fa-times", "maps-remove");
  divMaps.append(iconDelete);
  iconDelete.addEventListener("click", () => divMaps.remove());

  body.append(divMaps);
  function init() {
    const myMap = new ymaps.Map("maps", {
      center: coord,
      zoom: 15,
      controls: ["smallMapDefaultSet"],
    });
    myMap.geoObjects.add(
      new ymaps.Placemark(
        coord,
        {
          balloonContent: "Метка 1",
        },
        {
          iconColor: "red",
        }
      )
    );
  }
  ymaps.ready(init);
}
