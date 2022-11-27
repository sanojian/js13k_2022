
function soundPlayExtra(sound, pos, vol, pitch, rand = 0, delay = 0, repeat = 1, initDelay=0) {
	for (let i = 0; i < repeat; i++) { 
		setTimeout( () => sound.play(pos, vol, pitch, rand), initDelay + delay * (i+1) )
	}
 }




/// Player

var soundPlayerScream = new Sound([1,,440,,.1,1,3,1,-.2,,50,,,.4,,.05,.05,.9,.5,]);


var soundPickup = new Sound([1,.1,200,,,,4,,,1.2,50,.57,,,,.2,.2,,.2,]);



var soundLevelCleared = new Sound([2,0,685,0,.57,.3,0,3,.6,0,174,.08,.04,0,0,0,.15,.7,.1,.32])
	
	
//	[1.29, .05, 685, .04, .13, .23, 2, 1.91, .6, 0, 174, .08, .04, 0, 0, 0, .06, .98, .28, .14]);


/// Weapons

var soundRifle = new Sound([3,,164.8138,,,,4,,,,,,,,,-.3]);
var soundPistol = new Sound([1,,164.8138,,,,4,,,,,,,,,-.3]);
var soundShotgun = new Sound([3,,352,.07,.01,.2,4,3,,.4,,,.15,1.5,,.7,.12,.2]);

var soundBulletHit =new Sound([1,.1,137,.02,.02,.04,4,2.98,-0.9,-3.5,0,0,0,1.6,-2.3,.1,0,.87,0,0]);
	
var soundGunReload = new Sound([,.3,,.01,,.01,4,,20,6,600,.07,.3,3.6,12,,,,,.12]);
var soundGunEmpty = new Sound([1,,65,,,.02,4,,,,,,,2,,,,1,,0]);



/// Monsters

var soundEnemyGroan = new Sound([ 1,.5,329.6276,.16,.62,.33,,.5,,,-50,.14,.13,2.5,28,,,.9,.07,.12,]);
var soundBossStep = new Sound([3.5,,15,.02,.1,.05,,3.67,,.6,,,.13,1.8,,.3,,.35,.01]);
var soundBossThrow = new Sound([,,1650,.01,.09,.02,4,.5,1,,,.06,,,13,,,.9,.1]);
var soundBossTearing = new Sound([1.08,,50,,.18,.45,4,,,,,,.01,.3,,1.2,,.3,.11]);
var soundVampireGroan = new Sound([,.1,3665.40639,.12,.05,.09,3,.7,7.4,2.5,,.19,,.9,12,,.04,-.57,.13,]);
var soundGhostGroan = new Sound([2, .1, 130, .06, .2, .5, 0, 1, 0, -2, 0, .3, .3, .1, 0, .1, .01, .8, .07, 0]);
	
	
	//.5, .1, 523.2511, .06, .2, .5, 0, 1, 0, -2, -100, .3, .3, .1, 100, .1, .01, .8, .07, 0]);
	
	//1.01, 0, 523.2511, .06, .2, .15, 0, .07, 0, -1, 0, 0, .3, 1, 0, 0, .1, .49, .07, .33]);


var soundBoulderDestroy = new Sound([1.08,,50,,.18,.45,4,,,,,,.01,.3,,1.7,,.3,.11]);