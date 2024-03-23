import {
	Mesh,
	BoxGeometry,
	MeshBasicMaterial,
	MathUtils
} from 'three';

import {
	Vec3,
	Box,
	Body,
	Quaternion
} from 'cannon-es';

export class Player {
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

		this.mass = info.mass || 0;
		this.cannonWorld = info.cannonWorld;
		this.cannonMaterial = info.cannonMaterial;
	
    const geometry = new BoxGeometry(this.width, this.height, this.depth);
    const material = new MeshBasicMaterial({
      transparent: true,
			opacity: 0
    });
    this.mesh = new Mesh(geometry, material);
    this.mesh.position.set(this.x, this.y, this.z);
    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
    info.scene.add(this.mesh);

    this.setCannonBody();
	}

	walk(value, direction) {
		if (direction === 'left') {
			this.rotationY -= MathUtils.degToRad(90);
		}
		if (direction === 'right') {
			this.rotationY += MathUtils.degToRad(90);
		}

		this.x += Math.sin(this.rotationY) * value;
		this.z += Math.cos(this.rotationY) * value;
		if (this.cannonBody) {
			this.cannonBody.position.x = this.x;
			this.cannonBody.position.z = this.z;
		}
	}

	walkMobile(value, radian) {
		const angle = this.rotationY + radian + MathUtils.degToRad(90);
		this.x += Math.sin(angle) * value;
		this.z += Math.cos(angle) * value;
		this.cannonBody.position.x = this.x;
		this.cannonBody.position.z = this.z;
	}

	setCannonBody() {
		this.cannonBody = new Body({
			mass: this.mass,
			position: new Vec3(this.x, this.y, this.z),
			shape: new Box(new Vec3(this.width/2, this.height/2, this.depth/2)),
			material: this.cannonMaterial
		});

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