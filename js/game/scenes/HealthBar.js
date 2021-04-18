/**
 * Player health bar
 */
 class HealthBar {
    constructor(scene, x, y, health, width, height) {
      this.bar = new Phaser.GameObjects.Graphics(scene);
  
      this.x = x;
      this.y = y;
      this.totalHealth = health;
      this.currentHealth = health;
      this.height = height;
      this.width = width;

      this.draw();
  
      scene.add.existing(this.bar);
    }
  
    decrease(amount) {
      this.health -= amount;
  
      if (this.health < 0) {
        this.health = 0;
      }
  
      this.draw();
  
      return this.health === 0;
    }
  
    draw() {
      this.bar.clear();
  
      //  BG
      this.bar.fillStyle(0xf9f0d9);
      this.bar.fillRect(this.x, this.y, this.width + 4, this.height);
  
      //  Health
      this.bar.fillStyle(0xffffff);
      //this.bar.fillRect(this.x + 2, this.y + 2, 200, 12);
  
      const healthPercent  = (this.currentHealth / this.totalHealth)
      if (healthPercent < .3) {
        this.bar.fillStyle(0xff0000);
      } else {
        this.bar.fillStyle(0x00ff00);
      }
  
      const colorBarW  = healthPercent * this.width;
      const colorBarH =  this.height - 4;
      this.bar.fillRect(this.x + 2, this.y + 2, colorBarW,colorBarH);
    }
  }
  