import { UniqueEntityId } from './unique-entity-id'

export abstract class Entity<Props> {
  private _id: UniqueEntityId
  protected props: Props

  protected constructor(props: Props, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId()
    this.props = props
  }

  public get id() {
    return this._id
  }

  public equals(other: Entity<unknown>) {
    if (other === this) {
      return true
    }

    if (other.id === this._id) {
      return true
    }

    return false
  }
}