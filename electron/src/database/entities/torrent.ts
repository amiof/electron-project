import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm"
import { STATUS_TYPE, Tfile, TTorrentRes } from "../../types"

@Entity("torrents")
export class Torrent implements TTorrentRes {
  @PrimaryColumn({ type: "text", nullable: false })
  gid!: string
  
  @Column({ type: "text", nullable: false })
  infoHash!: string
  
  @Column({
    type: "text",
    nullable: false,
    default: "{\"announceList\":[]}",
    transformer: {
      to: (value: { announceList: string[][] }) => JSON.stringify(value),
      from: (value: string) => JSON.parse(value) as { announceList: string[][] }
    }
  })
  bittorrent!: { announceList: string[][] }
  
  @Column({
    type: "text",
    enum: STATUS_TYPE,
    default: STATUS_TYPE.WAITING,
    nullable: false
  })
  status!: STATUS_TYPE
  
  @Column({ type: "text", nullable: false, default: "0" })
  completedLength!: string
  
  @Column({ type: "text", nullable: false, default: "0" })
  totalLength!: string
  
  @Column({ type: "text", nullable: false, default: "0" })
  numPieces!: string
  
  @Column({ type: "text", nullable: false, default: "0" })
  pieceLength!: string
  
  // Speeds & peers
  @Column({ type: "text", nullable: false, default: "0" })
  downloadSpeed!: string
  
  @Column({ type: "text", nullable: false, default: "0" })
  uploadSpeed!: string
  
  @Column({ type: "text", nullable: false, default: "0" })
  uploadLength!: string
  
  @Column({ type: "text", nullable: false, default: "0" })
  connections!: string
  
  @Column({ type: "text", nullable: false, default: "0" })
  numSeeders!: string
  
  @Column({ type: "text", nullable: false, default: "false" })
  seeder!: string
  
  @Column({
    type: "text",
    nullable: false,
    default: "[]",
    transformer: {
      to: (value: Tfile[]) => JSON.stringify(value),
      from: (value: string) => JSON.parse(value) as Tfile[]
    }
  })
  files!: Tfile[]
  
  @Column({ type: "text", nullable: false })
  dir!: string
  
  @CreateDateColumn({ type: "datetime", nullable: false })
  createdAt!: Date
  
  @UpdateDateColumn({ type: "datetime", nullable: false })
  updatedAt!: Date
}