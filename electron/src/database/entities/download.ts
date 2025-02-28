import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"


export interface IDownloads {
  Id?: number
  FileName: string
  Url: string
  SavePath: string
  Size: string
  CreatedAt?: Date
  Percentage?: number
  Status?: DOWNLOAD_STATUS
  Gid: string
  NumberConnections: number
}

enum DOWNLOAD_STATUS {
  ERROR = "error",
  COMPLATED = "complated",
  NOT_STARTED = "not-started",
  DOWNLOAD = "download"
}

@Entity("downloads")
export class Download implements IDownloads {
  @PrimaryGeneratedColumn()
  Id!: number
  
  @Column({ type: "text", nullable: false })
  Gid!: string
  
  @Column({ type: "text", nullable: false })
  FileName!: string
  
  @Column({ type: "text", nullable: false, default: DOWNLOAD_STATUS.NOT_STARTED })
  Status!: DOWNLOAD_STATUS
  
  @Column({ type: "text", nullable: false })
  Url!: string
  
  @Column({ type: "text", nullable: false })
  SavePath!: string
  
  @Column({ type: "text", nullable: false, default: "0" })
  Size!: string
  
  @Column({ type: "integer", nullable: false, default: 0 })
  Percentage!: number
  
  @Column({ type: "text", nullable: false, default: 64 })
  NumberConnections!: number
  
  @CreateDateColumn({ type: "datetime", nullable: false })
  CreatedAt!: Date
}