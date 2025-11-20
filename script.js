document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nv-l");
  const main = document.getElementById("content");
  const searchInp = document.querySelector("#search");
  
  async function loadPage(file) {
    try { // https://sqlpey.com/javascript/top-4-methods-to-return-html-using-fetch-api/
      const response = await fetch(file); // recupere le fichier
      const html = await response.text(); // transforme en text

      const parsed = new DOMParser().parseFromString(html, "text/html"); // go from a "normal" html string to a usable DOM object
      main.innerHTML = parsed.body.innerHTML; // now that we have something we can manipulate put it in the body of the page
    } catch {
      main.innerHTML = `<div class="error">Erreur lors du chargement de ${file}</div>`;
    }
  }

  links.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();

      links.forEach(l => l.classList.remove("h"));
      link.classList.add("h");

      loadPage(link.dataset.page);
    });
  });

  searchInp.addEventListener("change", (e) => {
    let userInput = e.target.value.replace(" ", "-").toLowerCase(); // iut pres -> iut-pres

    // convert to an array with from (bc links is a NodeList, there's no find function for a nodlist, i have to do it by hand with a for loop)
    // then using find going trough the link to find the coresponding one
    // going through all the 'a' balise in the main html to see if there's an page based on this name
    
    let searchLink = Array.from(links).find(link => {
      let pageName = link.dataset.page.replace("pages/", "").replace(".html", "").toLowerCase();

      // si file: [ages/iut-presentation.html et inp: iut, iut est dans le nom du fichier (s'il n'y en a qu'un seul et va sinon tjr prendre le 1er)
      return pageName.includes(userInput);
    });

    if (searchLink){ // either undefined bc not found or an 'a link' (= True)
      loadPage(searchLink.dataset.page);
    } else {
      console.log("404");
    }
  });
  
  loadPage("pages/cv-resume.html");
});