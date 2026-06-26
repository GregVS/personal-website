---
created: 2025-01-04
modified: 2025-01-05
---
*This is an app I made in 2020. [GitHub link](https://github.com/GregVS/Fantasy-Track-Backend/tree/master)*

I was on the track team all throughout high school. I wasn't particularly stellar, but I loved it and had a good group of friends on the team. We decided it would be fun to bet on teammates. So we started a fantasy league. We would draft athletes from our school to assemble our fantasy team and earn points based on how they performed at the meets. 

It started as a Google sheets game. Every week we'd check the results posted online and calculate how many points each person earned. It was quite tedious and no one trusted each other's calculations. So I made us an app.

## Features
- Support for any high school using [Athletic.net](https://www.athletic.net/) (They gave me permission to scrape results from their site)
- Snake draft for initial fantasy team creation
- Automated meet results fetching and scoring
- Predicted future scores for athletes
- Support for trading athletes among fantasy teams
## Screenshots
![[fantasy-track-1.png|400]] ![[fantasy-track-2.png|400]] ![[fantasy-track-3.png|400]] ![[fantasy-track-4.png|400]]

## Post-release
My coach was a big fan of the competitive but supportive spirit it brought to our team. But it wasn't just for my friends. Fantasy Track gained quite a bit of popularity in the local county. I advertised by word-of-mouth at our track meets and got about 500 downloads in the first two weeks. A good number of groups from other schools made leagues on the app (they were able to draft students from their own team). But this was in late Feb of 2020... After those two weeks, COVID hit and there were no more track meets, so the app had an unfortunately short lifespan.

## Nerd note: abstraction
In some sense, this project was an exercise to design a scalable, maintainable, and easy to read codebase. Admittedly, it's heavily abstracted -- perhaps I over-subscribed to [Uncle Bob](http://cleancoder.com/). At the time, I thought of abstraction as mostly a way to make my code look prettier and keep my class definitions small. Although there are things I would do differently, I do appreciate how easy the functions are to understand. Below is a snippet of some code that runs when a player drafts an athlete. It's quite simple to understand the effects of this function.
```java
  public void draft(ContractRequest contract) throws ApplicationException {
        synchronized (DraftRegistrar.draftLocks.get(context.leagueId)) {
            logger.info("User requesting contract: " + contract);
            Turn currTurn = turnRepository.getCurrentTurn();
            if (settingsRepository.getDraftStatus() != DraftStatus.RUNNING
                    || currTurn == null
                    || !(currTurn.teamId.equals(contract.teamId))
                    || currTurn.isHasPicked()) {
                throw new NotCurrentlyPicking();
            }
            contractEditor.signContract(contract);
            currTurn.setHasPicked(true);
            DraftRegistrar.draftLocks.get(context.leagueId).notify();
        }
    }
```
