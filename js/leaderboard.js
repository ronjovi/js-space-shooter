/**
 * Once DOM is ready, pull the highscores from the database
 */
$(document).ready(function () {
  getAllScores();
});

/**
 * Make request to server from score data
 */
function getAllScores() {
  $.ajax({
    type: "GET",
    contentType: "application/json",
    url: "https://ronjovi-server.herokuapp.com/rob/space-odyssey/scores",
    dataType: "json",
    success: function (payload) {
      // add score to the view
      appendScores(payload.data);
    },
    error: function (error) {
      // show error message
      showToast(error.responseJSON.message, "error");
    },
    complete: function () {
      hideLoader();
    },
  });
}

/**
 * Append scores to view by creating elements to add to DOM
 * @param {object[]} scores list of score objects
 */
function appendScores(scores) {
  // sort in descending order
  scores.sort(compare);

  // get the top three scores
  const topPlayers = scores.slice(0, 3);
  // remove top 3 players from list
  scores.splice(0, 3);

  // top 3 get appended in top container
  topPlayers.forEach((score, index) => {
    appendTopScoreElement(score, index + 1);
  });

  // rest of the score get appended in the lower container
  scores.forEach((score, index) => {
    appendScoreElement(score, index + 3);
  });
}

/**
 * Creates the player score elements for the top three players
 * Rank 1 player will have a crown
 * @param {object} score score object
 * @param {number} index rank of the score -> index start at 1
 */
function appendTopScoreElement(score, index) {
  // id for score
  let positionId = "";

  // get the id for the score
  // index start at 1 instead of 0
  if (index === 1) {
    positionId = "one";
  } else if (index === 2) {
    positionId = "two";
  } else {
    positionId = "three";
  }

  const container = $(`<div id="${positionId}" class="score"></div>`);
  const rank = $(`<p class="num">${index}</p>`);
  // score profile image
  // we use robohash.org to create free random robot images using the score name
  const profileImage = $(
    `<img class="thumbnail" src="https://robohash.org/${score.name.replace(/\s/g, '')}" alt="profile image for ${score.name}" />`
  );
  const name = $(`<p class="name">${score.name}</p>`);
  const scoreVal = $(`<p class="score-val">${score.score}</p>`);

  // only rank one gets the crown
  if (index === 1) {
    const crown = $(`<img id="crown" src="../images/gui/crown.png" alt="Crown">`);
    container.append(rank, crown, profileImage, name, scoreVal);
  } else {
    container.append(rank, profileImage, name, scoreVal);
  }

  $("#top-3").append(container);
}

/**
 * Creates elements for the other players that are not in the top 3
 * These are added to the lower container
 * @param {object} score score object
 * @param {number} index rank position
 */
function appendScoreElement(score, index) {
  const container = $(`<div class="list-player"></div>`);
  const rank = $(`<p class="index">${index}</p>`);
  const stats = $(`<div class="list-stats"></div>`);
  const profileImage = $(
    `<img class="list-thumbnail" src="https://robohash.org/${score.name.replace(/\s/g, '')}" alt="profile image for ${score.name}" />`
  );
  const name = $(`<p class="list-name">${score.name}</p>`);
  const scoreVal = $(`<p class="list-score">${score.score}</p>`);

  stats.append(profileImage, name, scoreVal);
  container.append(rank, stats);
  $("#list").append(container);
}

/**
 * Hides loader
 * changes opacity to 0 for fade effect
 * changes display to none after 300ms - we wait for fade out to finish
 */
function hideLoader() {
  $("#loader").animate({ opacity: 0 }, 300, function () {
    setTimeout(() => {
      $(this).css({ display: "none" });
    }, 300);
  });
}

/**
 * Shows toast message
 * Can be green for server req success, red for server req error
 * @param {string} msg message from server
 * @param {string} type response type (success/error)
 */
function showToast(msg, type) {
  $("#alert-msg").text(msg);

  // detect the type of alert
  if (type === "error") {
    $("#toast").addClass("bg-danger");
  } else {
    $(".bg-danger").removeClass("bg-danger");
  }

  // set fade in / fade out animation
  $(".toast").animate({ opacity: 1 }, function () {
    setTimeout(() => {
      $(this).animate({ opacity: 0 });
    }, 2500);
  });
}

/**
 * Sorts the scores by checking the objects score value
 * Returns array in descending order
 * @param {object} a score object
 * @param {object} b score object
 * @returns
 */
function compare(a, b) {
  const bandA = a.score;
  const bandB = b.score;

  let comparison = 0;
  if (bandA < bandB) {
    comparison = 1;
  } else if (bandA > bandB) {
    comparison = -1;
  }
  return comparison;
}
