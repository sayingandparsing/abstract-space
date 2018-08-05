

export class Pipe<I> {

	val :I|Promise<I>

	constructor(value :I) {
		this.val = value
	}

	static pipe<I>(value :I) {
		return new Pipe<I>(value)
	}

	to<O>(fn :(I)=>O) :Pipe<O> {
		return new Pipe<O>(fn(this.val))
	}

	also<O>(fn :(I)=>O) :Pipe<I> {
		fn(this.val)
		return this
	}
}



export class Some<TVal> {
	value :TVal
	constructor(value :TVal) {
		this.value = value
	}

	static of<TNew>(value :TNew|null) :Maybe<TNew> {
		return (value)
			? new Some<TNew>(value)
			: new None
	}

	map<TOut>(fn :(T)=>TOut) :Maybe<TOut> {
		return Some.of(fn(this.value))
	}

	to<TOut>(fn :(T)=>TOut) :Maybe<TOut> {
		return Some.of(fn(this.value))
	}
}

export class None {

	map<TOut>(fn :(T)=>TOut) :Maybe<TOut> {
		return this
	}

	to<TOut>(fn :(T)=>TOut) :Maybe<TOut> {
		return this
	}
}


export type Maybe<T> = Some<T> | None

