DEAD AGAIN
=====

by sanojian and repsej


Death was not enough to keep these evil spirits down.  

Defend yourself against the onslaught of zombies, vampires, ghosts ... and more.   

The longer you play, the stronger they get.  

Survive for as long as you can, but it is only a matter of time before you are ... DEAD AGAIN


----------------------------------

Desktop controls:

 - WASD or arrow keys to move.  Mouse to aim.
 - R or SPACE to reload you weapon

Mobile controls:

 - Left stick to move (release to reload)
 - Right stick to aim (release to shoot)

----------------------------------

Game tips:

 - Boarded up doors can be shot to pieces.
 - Be careful around corners.
 - Preserve your ammo.  
 - Extra ammo is hidden around the maps.
 - A shotgun can kill multiple enemies with one shot.

----------------------------------

Tools:

 - LittleJS
 - ZzFX
 - ZzFXM

 - grunt
 - UglifiyJS
 - google-closure-compiler
 - steamroller
 - advzip

----------------------------------

Contact and links:

sanojian:

	Jonas Olmstead
	https://sanojian.itch.io/


repsej:

	Jesper Rasmussen
	https://onelifeleft.itch.io/
	https://www.linkedin.com/in/repsej/


----------------------------------

Thanks:

 - Thanks to "Andrei Moskvitin Josephsen" for composing the awesome music.

 - Thanks to our friends and colleagues at FRVR for beta testing and providing feedback.



---------------------------------

Funny / interesting tricks used in the game:

 - Each mob only has one sprite frame.  For most mobs we mirror it along the x axis to create the two frames of the "walk animation".  For the bat (flapping it wings) we do it on the y-axis.

 - After the bat has bitten the player it will try to get away while it transforms.  This behavior was created by setting the bats movement speed to a negative value after it hit the player.  So, the poor bat "thinks" it is still attacking the player ... while it is actually moving away.

 - The shadow / line of sight effect was inspired by ye ole ZX Spectrum game "Out of the Shadows" (from 1984).

 - The game has a system of "force fields" that affects all enemies.  
	- Each enemy is slightly repulsed by other enemies ... making them spread out more.  
	- Each tile w collision (wall/tree/grave stone/etc) repulse enemies, making the enemies better at getting around these things. 
	- The player leaves attractive footprints that sucks the enemies closer.  Helping the enemies getting through doorways, etc.

 - There are only really three unique maps.  Map 5 (w the boss) is unique.  But, map 1 and 3 are "the same".  Map 2 and 4 are "the same".  They are just rotated 90 degrees and mirrored on the x-axis.

 - To make the gun sounds louder each sound is played multiple times on top of each other. 
