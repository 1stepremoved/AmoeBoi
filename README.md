[Live](https://1stepremoved.github.io/AmoeBoi)

Osmosis (or AmoeBoi) is a become-the-largest style game built entirely using JavaScript and canvas. The goal is to navigate the field and absorb smaller amoebae until your amoeba is the largest (or last remaining). You propel yourself through the field by shooting off a little of your own mass, pushing you in the opposite direction.

It uses a custom built physics engine to determine the acceleration and absorption rate of each amoeba. The arrow keys allow you to control how quickly time passes, allowing you to speed along your direction without waiting using more mass.

For increased efficiency amoebae are organized in a quadtree and collisions are calculated recursively down the branches, with no redundant calculations. This brings collision detection to O(n) efficiency under ideal circumstance, and o(nlogn) on average.
