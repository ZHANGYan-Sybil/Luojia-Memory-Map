
# Development Process — Luojia Memory Map

## 1. Initial Idea

Luojia Memory Map is an interactive website that connects personal memories with geographical locations around Wuhan University.

The idea came from my interest in the relationship between places and personal experiences. A location may appear ordinary on a map but hold a meaningful story for someone who has studied, lived, or spent time there.

I wanted to create a shared memory map where visitors could leave their stories anonymously and discover the experiences of others.

The intended users are Wuhan University students, alumni, and people with personal connections to the campus.

My initial design principles were:

- Allow visitors to choose their own locations.
- Keep participation anonymous and accessible.
- Make the interaction simple and understandable.
- Prioritize one complete interaction over unnecessary features.

## 2. Development and Iteration

### Building the Main Interaction

I started with HTML, CSS, and JavaScript, creating a simple webpage to understand how user actions could produce visible changes.

I then integrated Leaflet to build an interactive map.

The main interaction allows visitors to select a location, write a memory, save it, and see the result as a marker on the map.

Initially, I stored memories in a JavaScript array. This helped me test the interaction before introducing a database.

Later, I connected the website to Supabase so memories could remain available after refreshing the page and could be shared between different visitors.

I also added input validation, character counting, loading feedback, and error messages.

### Redesigning the Interface

The early version placed the writing panel below the map. I found that this weakened the connection between selecting a location and writing a memory.

I redesigned the website around a larger map, with a floating writing panel and a plus button beside the selected location.

Inspired partly by Queering the Map, I wanted the geographical interface itself to become the main space for interaction.

I also developed a visual style inspired by Wuhan University's identity, using campus colors, a customized map, and paper-like memory panels.

The Chinese title became "珞珈记忆档案" to emphasize the idea of collecting and preserving personal stories.

I simplified the interface by removing repetitive text, adjusting typography, and making the memory content more prominent.

### Solving Technical Problems

One of the most challenging problems was making the website work on different devices.

The original OpenStreetMap background sometimes failed to load on computers other than my own, even though the website and memory markers were accessible.

I investigated the issue using browser developer tools, network requests, and tests on different devices and connections.

I eventually moved to MapTiler while keeping Leaflet for the existing map interaction.

I also created a custom map style called WHU to better match the website's visual identity.

During integration, I encountered incorrect dependency URLs, HTTP 404 errors, and API key restrictions that prevented the map from displaying.

After troubleshooting these issues and adjusting the configuration, I successfully tested the website on different devices.

This experience taught me that local functionality does not guarantee public accessibility. External services, API configuration, and network conditions are important parts of a working interactive experience.

## 3. User Testing

I shared the website with a classmate and collected feedback before finalizing the interface.

The classmate suggested removing the displayed latitude and longitude from the memory-writing panel.

Although these coordinates were useful to the program, they did not help visitors write their memories and occupied unnecessary space, especially on smaller screens.

I accepted this suggestion and removed the coordinate display, giving more space to the text input area.

I also refined parts of the color scheme based on feedback.

Another suggestion was to allow users to upload photographs alongside their memories.

I considered this idea but decided not to include it in the current version. Image uploads would require additional storage, validation, and interface complexity.

I chose to focus on making the existing text-based interaction clear and reliable.

This testing process helped me understand that improving usability sometimes means removing unnecessary information rather than adding new features.

## 4. AI Tools and Decisions

I used **ChatGPT (OpenAI)** throughout the project.

ChatGPT assisted with:

- Planning the initial project structure.
- Understanding HTML, CSS, and JavaScript.
- Generating and explaining code.
- Integrating Leaflet and Supabase.
- Investigating errors using browser developer tools.
- Discussing interface design and usability.
- Learning Git and GitHub workflows.
- Organizing development documentation.

### An AI Suggestion I Kept

ChatGPT recommended using Leaflet to build the interactive map and helped me integrate Supabase for persistent memory storage.

I adopted these suggestions because they supported the project's main interaction without requiring me to develop a mapping system or database infrastructure from scratch.

### AI Suggestions I Changed or Rejected

An early suggestion involved limiting memories to predefined locations.

I rejected this approach because I wanted visitors to choose places that were personally meaningful to them, including ordinary campus locations that might otherwise be overlooked.

I also decided against adding user registration and a complex moderation system.

Although these features could provide more control over contributions, I felt that mandatory registration would conflict with my original goal of creating a lightweight, anonymous experience.

Instead, I retained administrator-level control over inappropriate submissions.

### Reflecting on AI Assistance

AI suggestions were not always technically correct.

During MapTiler integration, some suggested dependency URLs were invalid and caused loading errors.

I needed to inspect browser errors, check documentation, and test different solutions rather than simply copying the generated code.

This experience helped me become more critical of AI-generated instructions.

I learned that understanding the basic principles behind APIs, external libraries, and web development is necessary to evaluate AI suggestions and use them effectively.

## 5. Final Reflection

The biggest lesson from this project was that building something for other people to use is very different from making a program work on my own computer.

A working interactive website depends on several connected systems. During development, I encountered problems involving JavaScript, cloud storage, map services, API keys, and cross-device accessibility.

These challenges made me realize that I needed to understand how different services communicate, rather than treating each piece of generated code as an isolated solution.

I also learned to make clearer design decisions. Instead of adding as many features as possible, I focused on the relationship between the visitor's action and the program's response.

Removing unnecessary coordinates, simplifying the writing process, and postponing image uploads helped keep the experience focused.

AI was valuable for learning and troubleshooting, but I became more aware of the importance of testing its suggestions and making my own decisions.

Ultimately, Luojia Memory Map is a relatively simple interactive experience. Its purpose is not technical complexity, but to allow ordinary campus locations to become places where personal stories can be shared and remembered.