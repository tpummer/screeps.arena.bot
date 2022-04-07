import { getObjectsByPrototype } from '/game/utils';
import { Creep, StructureSpawn, Source } from '/game/prototypes';
import { MOVE, WORK, CARRY, ATTACK, RESOURCE_ENERGY, ERR_NOT_IN_RANGE } from '/game/constants';

var workers = []
var fighters = []

var towers

var enemies

var mySpawn
var source

var spawndelay = 0

export function loop() {
	init()
	spawn()
	
	console.log('Workers: '+workers.length)
	console.log(workers)
	console.log('Fighters: '+fighters.length)
	console.log(fighters)
	
	if(fighters.length > 0){
		for(var creep of fighters) {
			var enemies = getObjectsByPrototype(Creep).find(creep => !creep.my);
			if(creep.id && creep.attack(enemies[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(enemies[0]);
			}
		}
	}
	
	if(workers.length > 0){
		console.log("There is a worker!")
		for(var creep of workers) {
			console.log(creep)
			if(creep.id && creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
				if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
					creep.moveTo(source);
				}
			} else {
				if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(spawn);
				}
			}
		}
	}
}

export function init(){
	source = getObjectsByPrototype(Source)[0];
	mySpawn = getObjectsByPrototype(StructureSpawn).find(i => i.my);
}

export function spawn(){
	if(spawndelay == 0){
		if(workers.length < 2) {
			if(mySpawn.store.getUsedCapacity(RESOURCE_ENERGY) >= 200){
				console.log("Spawning Worker!")
				workers.push(mySpawn.spawnCreep([MOVE, WORK, CARRY]).object);
				spawndelay=9
			}
		} else if(mySpawn.store.getUsedCapacity(RESOURCE_ENERGY) >= 130){
			console.log("Spawning Fighter!")
			fighters.push(mySpawn.spawnCreep([MOVE, ATTACK]).object);
			spawndelay=6
		}
	} else {
		spawndelay--
	}
}
