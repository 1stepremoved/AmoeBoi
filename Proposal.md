# Osmosis

Osmosis is a become-the-largest type of game, wherein you control a single amoeba that navigates the board absorbing smaller amoeba until it becomes the largest blob on the board. Movement is controlled by the mouse: clicking one direction will emit small bubbles from the player's ameoba, altering it's momentum but sacrifcing a small amount of mass. Holding down the mouse will create large bubbles that will propel the player farther, but sacrifice more mass. Ameoba's that are touched by larger ameoba's will not be immediately absorbed, but lose mass at a speed proportionate to the amount of overlap between the two ameoba's until there is no overlap.

### MVPs
 * Convincing physics for acceleration, and
 * Smooth absorption of smaller amoeba
 * No unwinnable scenarios (when generating ameobas, make certain there's a way to become the largest)
 * Gradient coloring to indicate whether ameoba's are smaller or larger than the player's amoeba
 
 ### Wireframes
 The game will always center on the player's amoeba. The entire page will display the surrounding area, though the marings of the page will be shaded to concentrate focus on the center of the screen, and allow for easier reading of the title and links.
 
 ![alt text](https://raw.githubusercontent.com/1stepremoved/Osmosis/master/repo/images/osmosis.png)
 
 ### Technologies and Libraries
 The game will be built using only JavaScript and the canvas library. Javascipt will be used to keep track of game physics and logic, and canvas will display the many amoeba.
 
 ### Implementation timeline
 
 Day 1: Set up webpack and reacquaint myself with canvas. Create the basic layout for the page and start working on the physics for the player's amoeba
 
 Day 2: Finish the logic for the main ameoba. Make sure the cursor provides responsive navigation. Then begin work on the generation of other ameoba. Focus on creating a winnable scenario.
 
 Day 3: Work on the absorption of one ameoba by another, and the transfering of momentum from one amoeba to the other.
