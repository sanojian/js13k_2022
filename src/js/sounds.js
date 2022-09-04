
function soundPlayExtra(sound, pos, vol, pitch, rand = 0, delay = 0, repeat = 1) {
	for (let i = 0; i < repeat; i++) { 
		setTimeout( () => sound.play(pos, vol, pitch, rand), delay * (i+i) )
	}
 }




/// Player

var soundPlayerScream = new Sound([1,,440,,.1,1,3,1,-.2,,50,,,.4,,.05,.05,.9,.5,]);


var soundPickup = new Sound([1,.1,200,,,,4,,,1.2,50,.57,,,,.2,.19,,.14,]);

/// Weapons

var soundRifle = new Sound([3,,164.8138,,,,4,,,,,,,,,-.3]);
var soundPistol = new Sound([1,,164.8138,,,,4,,,,,,,,,-.3]);
var soundShotgun = new Sound([3,,352,.07,.01,.2,4,3.04,,.4,,,.15,1.5,,.7,.12,.2]);

var soundBulletHit =new Sound([1,.3,440,.01,0,0,0,1.1,19.9,6.7,600,.09,.32,3.6,11,.2,0,.9,0,.12]);

var soundGunReload = new Sound([,.3,,.01,,.01,4,,20,6.6,600,.07,.32,3.6,12,,,,,.12]);
var soundGunEmpty = new Sound([1,,65,,,.02,4,,,,,,,2,,,,1,,0]);



/// Monsters

var soundEnemyGroan = new Sound([ 1,.5,329.6276,.16,.62,.33,,.5,,,-50,.14,.13,2.5,28,,,.9,.07,.12,]);
var soundBossStep = new Sound([3.5,,15,.02,.1,.05,,3.67,,.6,,,.13,1.8,,.3,,.35,.01]);
var soundBossThrow = new Sound([,,1650,.01,.09,.02,4,.5,1,,,.06,,,13,,,.9,.1]);
var soundBossTearing = new Sound([1.08,,50,,.18,.45,4,,,,,,.01,.3,,1.2,,.3,.11]);
var soundVampireGroan = new Sound([,.1,3665.40639,.12,.05,.09,3,.7,7.4,2.5,,.19,,.9,12,,.04,-.57,.13,]);



var soundBoulderDestroy = new Sound([1.08,,50,,.18,.45,4,,,,,,.01,.3,,1.7,,.3,.11]);