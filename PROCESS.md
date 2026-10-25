# Development Process — Luojia Memory Map

## 1. Initial Idea

**Project:** Luojia Memory Map
**Course Assignment:** Assignment 3 — An Interactive Experience

Luojia Memory Map is an interactive web experience that allows users to connect personal memories with geographical locations.

The idea was inspired by Wuhan University and the relationship between places and personal experiences. For students and graduates, an ordinary classroom, road, or lakeside location may hold meaningful memories that are not represented on a conventional map.

The intended users are Wuhan University students, alumni, and people interested in personal stories associated with places.

The main interaction is designed around a simple process:

1. The user explores an interactive map.
2. The user clicks any location they want to remember.
3. The user writes a short personal memory.
4. The program saves the memory and displays a marker at that location.
5. Other visitors can discover and read the memory.

The aim is to transform an ordinary geographical map into a shared space for personal stories.

### Initial Design Principles

* Allow users to choose any location rather than selecting only predefined landmarks.
* Keep the interaction simple and accessible.
* Do not require user registration or personal identification.
* Prioritize a working interaction over unnecessary features.
* Give users clear feedback after their actions.

---

## 2. Development Log

This section records important development steps, problems, changes, and results.

### Development Entry 01 — Building the First Interactive Webpage

**Date:** 25 October 2026

**Goal**

Set up the development environment and create a basic webpage that responds to user actions.

**Implementation**

I created the project using HTML, CSS, and JavaScript in Visual Studio Code.

The first version included a project title, a short introduction, and two buttons.

One button changed the message displayed on the page. The other reset the message to its original state.

**Result**

The webpage ran successfully using Live Server.

Both buttons worked as intended. This initial exercise helped me understand how JavaScript connects a user action with a visible response.

**Learning**

A meaningful interactive experience requires more than visual elements. The program needs to detect user input, update its state, and communicate the result.

---

### Development Entry 02 — Adding an Interactive Map

**Date:** 25 October 2026

**Goal**

Replace the initial button demonstration with a geographical map that users can explore.

**Implementation**

I integrated the Leaflet JavaScript library and used OpenStreetMap as the initial map source.

I also added an initial map location and a sample marker.

The webpage layout was updated to provide a larger map area.

**Problem**

When I first opened the updated webpage, the page title and layout appeared correctly, but the map area was blank.

The browser Console displayed the following error:

`Uncaught SyntaxError: Unexpected token '<' (at script.js:1:1)`

During troubleshooting, a direct request for an OpenStreetMap map tile also returned a `403 Access blocked` message.

**Investigation**

I used the browser's developer tools to inspect the error.

I also checked whether the Leaflet library could be accessed and tested the map tile URL separately.

The Leaflet JavaScript file was accessible, but the map tile request returned an access restriction.

The syntax error suggested that the browser encountered an unexpected HTML-like character while processing the JavaScript file.

**Solution**

I checked the JavaScript file and followed a step-by-step debugging approach.

A simple JavaScript alert was suggested as an isolated test to distinguish a general script-loading problem from an issue in the map initialization code.

I then continued testing the map implementation.

**Result**

The map eventually loaded successfully, and I confirmed that the zoom controls worked.

The earlier blank-map problem was resolved.

The exact cause of the original syntax error has not yet been independently confirmed.

**Learning**

This problem showed me the importance of testing different parts of a web application separately.

A webpage can display HTML and CSS correctly while its JavaScript fails.

Browser Console messages are useful for identifying problems, and testing one component at a time makes debugging easier.

### Development Entry 03 — Creating and Reading Memories

**Date:** [Enter actual completion date]

**Goal**

Implement the project's main interaction: allowing users to select any map location, write a personal memory, and see the memory appear on the map.

**Implementation**

I added a Leaflet map click event to capture the selected geographical coordinates.

When the user selects a location, the webpage displays a temporary marker and opens a text input panel.

The user can write a memory, submit it, and then click the resulting map marker to read the text.

I also added a character counter, a cancel button, and feedback messages.

**Error Handling**

The program checks whether the memory text is empty or contains only whitespace.

If the user attempts to submit an empty memory, the program displays an error message instead of creating a marker.

**Design Decision**

At this stage, I used a JavaScript array to store memories temporarily instead of immediately connecting the cloud database.

This allowed me to test the user interaction separately from the database.

**Testing and Result**

[Record the features you actually tested and whether they worked.]

**Learning**

[Describe what you learned from implementing and testing this interaction.]

**Remaining Limitation**

Memories are currently stored only in the active browser session and disappear when the page is refreshed. Persistent cloud storage is planned for the next stage.

### Development Entry 04 — Setting Up the Cloud Database

**Date:** [Enter the actual completion date]

**Goal**

Create a cloud database to store memories beyond the current browser session.

**Implementation**

I created a Supabase project and a `memories` table with five fields: ID, content, latitude, longitude, and creation time.

I configured Row Level Security to allow anonymous visitors to read and add memories, while preventing anonymous modification or deletion.

I also added database constraints to reject empty text and invalid geographical coordinates.

**Design Decision**

I decided to keep the database structure simple without user accounts or manual moderation.

This allows the project to focus on its main interaction while keeping the implementation manageable.

**Testing**

[Describe the actual results of inserting a valid memory, reading it back, and attempting to insert empty text.]

**Problems and Solutions**

[Record any setup or SQL errors and how they were resolved. If none occurred, state that.]

**Result and Learning**

[Describe what worked and what you learned about storing data in a cloud database.]

**Remaining Work**

The database has not yet been connected to the Leaflet webpage. This will be completed in the next development stage.


### Development Entry 05 — Connecting the Map to Supabase

**Date:** [Enter the actual completion date]

**Goal**

Connect the interactive Leaflet map to the Supabase database so that memories can be stored permanently and shared between browsers.

**Implementation**

I integrated the Supabase JavaScript client into the existing webpage.

The program now sends the user's memory text and selected geographical coordinates to the `memories` database table.

When the page loads, it retrieves previously saved memories and displays them as markers on the map.

After submitting a memory, the program checks the database response and reloads the saved records.

**Design Changes**

I replaced temporary JavaScript array storage with cloud database operations.

I also introduced a loading state for the save button and clearer feedback messages.

The program now distinguishes between a successfully saved memory and a failed request.

**Error Handling**

The program prevents empty submissions and repeated clicks while saving.

If a request fails, it displays an error message and keeps the user's unfinished text so they can investigate or try again.

**Testing**

[Record whether submitting, refreshing, cross-browser reading, and empty-input validation worked.]

**Problems and Solutions**

[Describe any actual issues, error messages, and fixes. If none occurred, say so.]

**Result**

[Complete after verifying the database connection.]

**Learning**

[Explain what you learned about asynchronous JavaScript, cloud databases, or feedback design.]

**Remaining Limitations**

The project currently uses a minimal anonymous contribution system without user accounts or content moderation.

The first prototype also limits each map load to 200 records. More advanced data loading and abuse prevention would be necessary for a larger public application.

### Development Entry 06 — Improving Usability and Visual Feedback

**Date:** [Enter actual completion date]

**Goal**

Improve the clarity and visual presentation of the memory map without adding unnecessary complexity.

**Design Issues Identified**

The previous version displayed the memory input panel below the map. After selecting a location, users might not immediately notice that a new panel had appeared.

The interface also did not show how many memories had been loaded.

**Changes Implemented**

I improved the layout and visual hierarchy using a consistent palette of warm cream, sage green, and dark forest green.

I also added:

* Automatic scrolling to the memory input panel after a location is selected.
* A visual warning when the memory text approaches its character limit.
* A memory counter showing the number of records loaded from the database.
* Improved spacing, buttons, and responsive layout.

**Design Rationale**

These changes were intended to make the interaction more understandable.

The automatic scrolling connects the user's map selection with the next required action. The memory counter provides an indication of the shared map's existing content.

**Testing and Results**

[Record the actual results of the Stage 6 tests.]

**Problems and Solutions**

**Problem:** After adding usability improvements, the map stopped loading. The browser Console displayed `Uncaught SyntaxError: Unexpected token '}'` in `script.js`.

**Investigation:** I inspected the relevant JavaScript lines and discovered that part of the previous character-count event listener had remained after replacing it with the updated version.

**Solution:** I removed three redundant lines, including an extra closing `});`, while keeping the new character-count logic.

**Result:** [Confirm whether the map and memory interaction work again after testing.]

**Learning:** When updating a JavaScript event listener, I need to replace the entire original block rather than leaving fragments of the old code. Browser Console errors and line numbers helped me identify the problem without rewriting the complete program.


**Learning**

[Explain what you learned about visual feedback, navigation, and interface clarity.]

**Next Step**

Conduct a user trial with another person and use the observations to evaluate the design.

### Development Entry 07 — Map-Centered Interface Redesign

**Date:** [Enter actual completion date]

**Goal**

Redesign the interface to make the map the central element of the experience and simplify the process of contributing a memory.

**Design Inspiration**

The layout was inspired by the map-centered interaction approach of Queering the Map.

Instead of arranging content in separate sections above and below the map, I wanted the entire experience to take place within the geographical interface.

**Changes**

I redesigned the page around a large interactive map with a compact title section.

I moved the memory counter and writing interface into floating elements above the map.

I also changed the memory creation process into two steps:

1. Select a location on the map.
2. Click the plus button beside the selected location to open the writing panel.

The writing panel now appears in the upper-right corner of the map.

I introduced an initial geographical browsing boundary around Wuhan University and its surroundings.

**Design Decisions**

I kept the existing Supabase database structure and memory-reading functionality.

I chose not to implement image uploads during this redesign because they would introduce additional storage and error-handling requirements.

The priority was to improve the existing interaction without making the project unnecessarily complex.

**Testing**

[Record the actual results of map loading, location selection, opening the writing panel, saving memories, refreshing, and testing map boundaries.]

**Problems and Solutions**

[Record any real errors encountered and the changes made.]

**Reflection**

[Explain whether the redesigned layout makes the interaction clearer, and what might still need improvement.]

### Development Entry 08 — Refining the Initial Map View

**Date:** [Enter actual completion date]

**Problem**

After redesigning the interface around a larger map, I noticed that the initial view displayed too much geographical information.

This made the experience less focused and could make it harder for first-time visitors to identify the main campus area.

**Design Change**

I restored the original campus-centered view with a zoom level of 15 while retaining the broader geographical browsing boundaries.

I also introduced a custom Home control underneath the map's zoom buttons.

Clicking this control returns the map to its original center and zoom level.

**Reasoning**

A more focused initial view helps communicate that the experience is centered on Wuhan University.

The Home button gives users a simple way to recover their location after exploring the wider map.

**Testing and Result**

[Record the actual results after testing the initial view, Home button, zooming, dragging, and memory interaction.]

**Reflection**

This iteration helped me distinguish between the geographical area a user is allowed to explore and the area that should be shown when the experience first opens.

### Development Entry 09 — Refining Map Visual Hierarchy

**Date:** [Actual date]

**Problem**

The initial map-centered design worked correctly, but its bright base map colors and default blue markers did not feel consistent with the intended warm, archival visual style.

An early CSS filter made the map less distracting, but it also made the overall appearance too grey and subdued.

**Design Changes**

I adjusted the map tile filter to preserve more color and improve brightness and contrast.

I refined the heading typography and introduced LXGW WenKai as the title font, while retaining a clear sans-serif style for functional text.

I replaced the default blue Leaflet markers with custom terracotta-red SVG pins featuring subtle highlights and shadows.

**Design Rationale**

I wanted the geographical information to remain useful while allowing the contributed memories to become the visual focus.

I chose a lightweight CSS filter instead of switching map providers because the existing Leaflet and OpenStreetMap implementation was already working reliably.

**Testing**

[Record actual results, including visual appearance, marker readability, interaction and database persistence.]

**Next Iteration**

Evaluate the map's information density, floating controls, and the visual design of the memory-reading and writing panels.

### Development Entry 10 — Paper-Inspired Memory Interface

**Date:** [Actual completion date]

**Goal**

Create a more consistent visual relationship between the map, memory markers, reading popups, and the writing panel.

**Design Change**

I redesigned the floating memory interface using a restrained stationery-inspired visual language.

Saved memory popups now use warm paper colors, subtle textures, and soft shadows.

The writing panel uses similar paper colors, while the text field includes faint blue horizontal lines inspired by a notebook.

I also refined button shapes, borders, spacing, and small interface elements.

**Design Rationale**

I wanted the experience of reading and writing a memory to feel different from using a standard web form.

At the same time, I deliberately kept the textures subtle so the map and memory text would remain readable.

**Technical Approach**

I implemented the changes with CSS rather than changing the existing Leaflet or Supabase application logic.

**Testing and Reflection**

[Fill in the actual visual and functional test results.]

**Next Step**

Review the new interface in the browser and refine visual details based on actual appearance and usability.



---

## 3. Design Decisions

### Decision 01 — Prioritizing the Core Interaction

I decided to focus on one complete interaction: selecting a location, writing a memory, and displaying it on a shared map.

I chose not to include user accounts, comments, likes, image uploads, or other social features in the first version.

**Reason:** The assignment emphasizes meaningful interaction, usability, and working implementation rather than the number of features.

### Decision 02 — Using a Real Interactive Map

I chose Leaflet rather than creating a static illustrated map.

**Reason:** Leaflet provides geographic coordinates, zooming, dragging, and markers. These functions directly support the project's core interaction.

A more customized visual map may be considered later, but it should not delay the working prototype.

### Decision 03 — Keeping Data Storage Simple

I plan to use Supabase for storing memory text and geographical coordinates.

The project will not require accounts or manual content approval at this stage.

Basic database permissions and input validation will still be necessary.

**Reason:** This is a small course prototype, so the priority is demonstrating a functioning interaction without unnecessary technical complexity.

---

## 4. User Testing and Iteration

**Status:** Not yet conducted.



---

## 5. AI Tools and Reflection

### AI Tool Used

**Tool:** ChatGPT (OpenAI)

### How AI Was Used

ChatGPT assisted with:

* Planning the project and defining a manageable scope.
* Explaining the relationship between HTML, CSS, and JavaScript.
* Generating and explaining initial example code.
* Providing step-by-step guidance for Leaflet integration.
* Suggesting debugging methods and helping interpret Console errors.
* Explaining Git and GitHub workflows.
* Organizing the development process and documentation.

All AI-assisted code must be run and tested before being considered complete.

### AI Suggestion I Kept
### Additional AI-Assisted Design Decision

ChatGPT suggested implementing cloud storage only after the basic map interaction was working.

I kept this suggestion because separating the interaction logic from the database setup made it easier to identify errors.

I also chose to keep the first version simple rather than adding authentication, advanced filtering, or a complex backend.

This decision helped me focus on the assignment's main requirement: a clear and working interaction between user input, program response, and feedback.



### AI Suggestion I Modified or Rejected



---

## 6. Final Reflection

**Status:** To be completed after development and user testing.

