
type Option = Object

interface Affordance {

	defineOptions() :Object[]

}


interface FileSelection extends Affordance {

}

enum FileOp {
	CREATE,
	OPEN
}

interface FileOperation {
	type :FileOp
	file :string
	path :string
	arg ?:string
}

interface FileCreation extends FileOperation {
	type: FileOp.CREATE
}
