import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"
import { STATUS_TYPE, Tfile, TtellRes } from "../../types"


@Entity("downloads")
export class Download implements TtellRes {
  @PrimaryGeneratedColumn()
  Id!: number
  
  @Column({ type: "text", nullable: false })
  bitfield!: string
  
  @Column({ type: "text", nullable: false })
  completedLength!: string
  
  @Column({ type: "text", nullable: false, default: 0 })
  connections!: string
  
  @Column({ type: "text", nullable: false })
  dir!: string
  
  @Column({ type: "text", nullable: false })
  downloadSpeed!: string
  
  @Column({ type: "text", nullable: false, default: "0" })
  errorCode!: string
  
  @Column({ type: "text", nullable: false, default: 0 })
  errorMessage!: string
  
  @Column({
    type: "text", nullable: false, default: "[]",
    transformer: {
      to: (value: Tfile[]) => JSON.stringify(value),
      from: (value: string) => JSON.parse(value)
    }
  })
  files!: Tfile[]
  
  @CreateDateColumn({ type: "text", nullable: false })
  gid!: string
  
  @Column({ type: "text", nullable: false })
  numPieces!: string
  
  @Column({ type: "text", nullable: false })
  pieceLength!: string
  
  @Column({ type: "text", enum: STATUS_TYPE, default: STATUS_TYPE.WAITING, nullable: false })
  status!: STATUS_TYPE
  
  @Column({ type: "text", nullable: false })
  totalLength!: string
  
  @Column({ type: "text", nullable: false })
  uploadLength!: string
  
  @CreateDateColumn({ type: "datetime", nullable: false })
  createdAt!: Date
}