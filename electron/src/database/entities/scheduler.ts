import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("scheduler")
export class Scheduler {
  @PrimaryGeneratedColumn()
  Id!: number
  
  @CreateDateColumn({ type: "text", nullable: false })
  gid!: string
  
  @CreateDateColumn({ type: "datetime", nullable: false })
  createdAt!: Date
}
