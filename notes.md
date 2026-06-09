
# Pipeline
**A document for future features, planned tasks and ideas**


## User Stories
**Section for tasks, that are ready and will be implemented next**

### Implement API key
- Add MENU_API_KEY as a repository secret under Settings → Secrets and variables → Actions.

### Update Backend API
- Do not include text on the images
- Only respond when API_KEY included

### Move to Azure Repository and hosting
- Azure Devops Repo
- Hosting on Azure Portal
- IAC: Terraform, or similar to setup hosting, domain, SSL, etc. 
- Pipelines to run IAC and build & publish website


## Future plans
**Features that will be implemented in the future, but are not fulle planned yet**

### Calendar should NOT be public
- SSO, only for Solitans
- May require different hosting (Ex. Azure)

### Include other Solita Locations
- If they can expose an API with menu and images, we can incorporate them


## Ideas
**Loose ideas or concepts that may become future features at some point**

- Include Drink and Friday Bar
- Move event categories to the event json, so they are always in view when adding events?
- Add area for games / JS showcases(?)
- JS Christmas cards 🎅
    - Can we make it so anyone can add JS files to be executed on the project, to add items/features? 
    - So we load any script in "Some folder". We need to verify that the scripts are legit, and comming from Solita
        - PR required. Required review by me, or other select members of the Solitarian dev team
    - Rules for the script: 
        - Has init function, that is called on load
        - Has a game-tick function, that is called in the game-loop
        - If interactable, ADDS to events, not overrides them
- Area for Pico8 scetches
    - Folder for projects
    - Fold-out menu, with each project name
    - Build Action builds each P8 project into JS, and creates a sub-page with the project
- Area for game scoreboards (Foosball, Guitarhero)
