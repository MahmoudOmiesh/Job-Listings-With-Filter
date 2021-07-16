const jobsList = document.querySelector(".jobs");
const filterDiv = document.querySelector(".filter");
const filterItemsList = document.querySelector(".filter__items");
const clearBtn = document.querySelector(".filter__clear");
let jobs = "";
let filterButtons;
let filters = [];

document.addEventListener("DOMContentLoaded", fetchData);

async function fetchData() {
	// fetch json file on load
	const res = await fetch("../data.json");
	const data = await res.json();

	addToUi(data);
}

function addToUi(data) {
	//adds data to UI based on JSON file
	data.forEach((job) => {
		// Get languages from array
		const jobLanguages = job.languages;
		let jobLanguage = ``;
		jobLanguages.forEach((language) => {
			jobLanguage += `<p class="job__requirement">${language}</p>`;
		});

		//get toold from array
		const jobTools = job.tools;
		let jobTool = ``;
		if (jobTools.length === 0) {
			jobTool = ``;
		} else {
			jobTools.forEach((tool) => {
				jobTool += `<p class="job__requirement">${tool}</p>`;
			});
		}

		let newTag = "";
		let featuredTag = "";

		if (job.new) newTag = `<p class="new">new!</p>`;
		if (job.featured) featuredTag = `<p class="featured">featured!</p>`;
		//add data to var
		jobs += `<li class="job__item" data-filter="${job.role}
		 ${job.level} ${jobLanguages.join(" ")} ${jobTools.join(" ")}">
		<img src="${job.logo}" class="job__logo" alt="logo"/>
		<div class="job__info">
			<div class="job__name">
				<h4 class="job__title">${job.company}</h4>
				${newTag}
				${featuredTag}
			</div>
			<h3 class="job__description">${job.position}</h3>
			<ul class="job__time" role="list">
				<li>
					<p>${job.postedAt}</p>
				</li>
				<li>
					<p>${job.contract}</p>
				</li>
				<li>
					<p>${job.location}</p>
				</li>
			</ul>
		</div>
		<div class="job__requirements">
			<p class="job__requirement">${job.role}</p>
			<p class="job__requirement">${job.level}</p>
			${jobLanguage}
			${jobTool}
		</div>
	</li>`;
	});

	//append variable
	jobsList.innerHTML = jobs;
}

jobsList.addEventListener("click", (e) => {
	if (e.target.classList.contains("job__requirement")) filterItems(e);
});

clearBtn.addEventListener("click", clearFilter);

function filterItems(e) {
	const filterText = document.querySelectorAll(".filter__text");
	for (text of filterText) {
		// breaks out of function if item alr exists
		if (e.target.textContent === text.textContent) return;
	}

	// Adding Filter To div
	filterDiv.style.visibility = "visible";
	const newFilterItem = document.createElement("div");
	newFilterItem.className = "filter__item";
	newFilterItem.innerHTML = `<p class="filter__text">${e.target.textContent}</p><img src="images/icon-remove.svg" class="filter__img"/>`;

	const deleteBtn = newFilterItem.querySelector(".filter__img");
	// add listener to close btn
	deleteBtn.addEventListener("click", clearFilterItem);

	filterItemsList.append(newFilterItem);
	// add tag to filter arr
	filters.push(newFilterItem.querySelector(".filter__text").textContent);
	const jobs = document.querySelectorAll(".job__item");

	filter(jobs);
}

function clearFilter() {
	filters = []; // reset filter div
	const filterItems = document.querySelectorAll(".filter__item");
	filterItems.forEach((item) => item.remove()); // remove filter items
	filterDiv.style.visibility = "hidden"; // hide div
	const jobs = document.querySelectorAll(".job__item");
	jobs.forEach((job) => (job.style.display = "flex")); // show all jobs back
}

function clearFilterItem(e) {
	e.target.parentElement.remove();
	const idx = filters.indexOf(e.target.previousElementSibling.textContent);
	filters.splice(idx, 1);
	const jobs = document.querySelectorAll(".job__item");
	filter(jobs);

	if (document.querySelectorAll(".filter__item").length == 0)
		filterDiv.style.visibility = "hidden";
}

function filter(jobs) {
	jobs.forEach((job) => {
		job.style.display = "none"; // hide all jobs
		// select jobs that match tag arr
		if (filters.every((fil) => job.dataset.filter.includes(fil))) {
			job.style.display = "flex"; // only show matching jobs;
		}
	});
}
