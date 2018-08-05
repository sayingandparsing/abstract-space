

import {Map} from "typescript"
import {log} from './util/logger'


class DataTransform {

	match = {
		Map: (str) => log.debug(str)
	}
}
