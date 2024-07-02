document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const resetBtn = document.getElementById("resetBtn");
  const resultsContainer = document.getElementById("resultsContainer");

  // Event listener for Search button click
  searchBtn.addEventListener("click", function () {
    const keyword = searchInput.value.toLowerCase();

    // Clear previous results
    resultsContainer.innerHTML = "";
    // Fetch data from the API based on the keyword
    fetch("travel_recommendation_api.json")
      .then((response) => response.json())
      .then((data) => {
        const recommendationType = getRecommendations(keyword);
        debugger;
        if (recommendationType) {
          displayRecommendations(data[recommendationType]);
        } else {
          resultsContainer.innerHTML =
            "<p>No recommendations found for this keyword.</p>";
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        resultsContainer.innerHTML =
          "<p>Failed to fetch recommendations. Please try again later.</p>";
      });
  });

  // Event listener for Reset button click
  resetBtn.addEventListener("click", function () {
    searchInput.value = "";
    resultsContainer.innerHTML = "";
  });

  function normalizeKeyword(keyword) {
    // Normalizar la palabra clave a minúsculas y eliminar espacios adicionales
    return keyword.trim().toLowerCase();
  }

  function isSimilarKeyword(keyword, targetKeyword) {
    // Normalizar ambas palabras clave y compararlas
    const normalizedKeyword = normalizeKeyword(keyword);
    const normalizedTargetKeyword = normalizeKeyword(targetKeyword);

    // Verificar si la palabra clave normalizada contiene la palabra clave objetivo
    return normalizedKeyword.includes(normalizedTargetKeyword);
  }

  function getRecommendations(keyword) {
    let key;

    // Normalizar y comparar con palabras clave y variaciones
    if (isSimilarKeyword(keyword, "beach")) {
      key = "beaches";
    } else if (isSimilarKeyword(keyword, "temple")) {
      key = "temples";
    } else if (isSimilarKeyword(keyword, "country")) {
      key = "countries";
    }

    return key;
  }

  // Function to display recommendations
  function displayRecommendations(recommendations) {
    recommendations.forEach((recommendation) => {
      const resultElement = document.createElement("div");
      resultElement.classList.add("result");

      const nameElement = document.createElement("h2");
      nameElement.textContent = recommendation.name;

      const imageElement = document.createElement("img");
      if (!recommendation.cities) {
        imageElement.src = recommendation.imageUrl;
        imageElement.alt = recommendation.name;
      } else {
        imageElement.src = recommendation.cities[0].imageUrl;
        imageElement.alt = recommendation.cities[0].name;
      }

      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = recommendation.description;

      resultElement.appendChild(nameElement);
      resultElement.appendChild(imageElement);
      resultElement.appendChild(descriptionElement);

      resultsContainer.appendChild(resultElement);
    });
  }
});
