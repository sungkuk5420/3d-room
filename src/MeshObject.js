import {
	Mesh,
	BoxGeometry,
	MeshLambertMaterial,
	MeshBasicMaterial
} from 'three';

import {
	Vec3,
	Box,
	Body,
	Quaternion
} from 'cannon-es';

export class MeshObject {
	constructor(info) {
		this.name = info.name;
		this.width = info.width || 1;
		this.height = info.height || 1;
		this.depth = info.depth || 1;
		this.color = info.color || 'white';
		this.differenceY = info.differenceY || 0.4;
		this.x = info.x || 0;
		this.y = info.y || this.height / 2 + this.differenceY;
		this.z = info.z || 0;
		this.x *= 1; // this.x = this.x * 1;
		this.y *= 1;
		this.z *= 1;
		this.rotationX = info.rotationX || 0;
		this.rotationY = info.rotationY || 0;
		this.rotationZ = info.rotationZ || 0;

		this.cannonShape = info.cannonShape || new Box(new Vec3(this.width/2, this.height/2, this.depth/2));

		this.mass = info.mass || 0;
		this.cannonWorld = info.cannonWorld;
		this.cannonMaterial = info.cannonMaterial;

		if (info.modelSrc) {
			// GLB
			info.loader.load(
				info.modelSrc,
				glb => {
					glb.scene.traverse(child => {
						if (child.isMesh) {
							child.castShadow = true;
						}
					});
					// console.log('loaded');
					this.mesh = glb.scene;
					this.mesh.name = this.name;
					this.mesh.position.set(this.x, this.y, this.z);
					this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
					info.scene.add(this.mesh);

					// Transparent Mesh for Raycasting
					const geometry = info.geometry || new BoxGeometry(this.width, this.height, this.depth);
					this.transparentMesh = new Mesh(
						geometry,
						new MeshBasicMaterial({
							color: 'green',
							transparent: true,
							opacity: 0
						})
					);
					this.transparentMesh.name = this.name;
					this.transparentMesh.position.set(this.x, this.y, this.z);
					info.scene.add(this.transparentMesh);

					this.setCannonBody();

					if (info.callback) info.callback();
				},
				xhr => {
					// console.log('loading...');
				},
				error => {
					// console.log('error');
				}
			);
		} else if (info.mapSrc) {
			const geometry = new BoxGeometry(this.width, this.height, this.depth);
			info.loader.load(
				info.mapSrc,
				texture => {
					const material = new MeshLambertMaterial({
						map: texture
					});
					this.mesh = new Mesh(geometry, material);
					this.mesh.name = this.name;
					this.mesh.castShadow = true;
					this.mesh.receiveShadow = true;
					this.mesh.position.set(this.x, this.y, this.z);
					this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
					info.scene.add(this.mesh);

					this.setCannonBody();
				}
			);
		} else {
			// Primitives
			const geometry = new BoxGeometry(this.width, this.height, this.depth);
			const material = new MeshLambertMaterial({
				color: this.color
			});
			this.mesh = new Mesh(geometry, material);
			this.mesh.name = this.name;
			this.mesh.castShadow = true;
			this.mesh.receiveShadow = true;
			this.mesh.position.set(this.x, this.y, this.z);
			this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
			info.scene.add(this.mesh);

			this.setCannonBody();
		}
	}

	setCannonBody() {
		this.cannonBody = new Body({
			mass: this.mass,
			position: new Vec3(this.x, this.y, this.z),
			shape: this.cannonShape,
			material: this.cannonMaterial
		});

		// this.cannonBody.quaternion.setFromAxisAngle(
		// 	new Vec3(0, 1, 0), // y
		// 	this.rotationY
		// );

		// rotation: x
		const quatX = new Quaternion();
		const axisX = new Vec3(1, 0, 0);
		quatX.setFromAxisAngle(axisX, this.rotationX);

		// rotation: y
		const quatY = new Quaternion();
		const axisY = new Vec3(0, 1, 0);
		quatY.setFromAxisAngle(axisY, this.rotationY);

		// rotation: z
		const quatZ = new Quaternion();
		const axisZ = new Vec3(0, 0, 1);
		quatZ.setFromAxisAngle(axisZ, this.rotationZ);

		const combinedQuat = quatX.mult(quatY).mult(quatZ);
		this.cannonBody.quaternion = combinedQuat;

		this.cannonWorld.addBody(this.cannonBody);
	}
}

export class Lamp extends MeshObject {
	constructor(info) {
		super(info);
	}

	togglePower() {
		if (this.light.intensity === 0) {
			this.light.intensity = 7;
		} else {
			this.light.intensity = 0;
		}
	}
}

export class RoboticVaccum extends MeshObject {
	constructor(info) {
		super(info);
		this.powerOn = false;
		this.r = 0;
		this.angle = 0;
		this.originX = this.x;
		this.originZ = this.z;
	}

	togglePower() {
		this.powerOn = !this.powerOn;
	}

	move() {
		if (this.powerOn) {
			this.cannonBody.position.x = this.originX + Math.cos(this.angle) * this.r;
			this.cannonBody.position.z = this.originZ + Math.sin(this.angle) * this.r;
			this.angle += 0.003;
			this.r = Math.sin(this.angle * 2);
		}
	}
}