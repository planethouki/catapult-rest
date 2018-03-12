// differentiate between object, array and null even though they all report the same type ('object')
const isObject = object => 'object' === typeof object && !Array.isArray(object) && null !== object;

const areCompatible = (lhs, rhs) =>
	typeof lhs === typeof rhs && ((null === lhs) === (null === rhs)) && (Array.isArray(lhs) === Array.isArray(rhs));

/** @exports utils/objects */
const objects = {
	/**
	 * Deeply assigns properties in target from one or more source objects.
	 * @param {object} target The target object.
	 * @param {...object} sources The source objects with latter objects having precedence.
	 * @returns {object} The target object (for chaining).
	 */
	deepAssign: (target, ...sources) => {
		sources.forEach(source => Object.keys(source).forEach(key => {
			if (isObject(target[key]) && isObject(source[key]))
				objects.deepAssign(target[key], source[key]);
			else
				target[key] = source[key];
		}));

		return target;
	},

	/**
	 * Checks an object against a template and ensures that the object does not contain any properties not in the template
	 * and that all of its properties have the correct types as defined by the template.
	 * @param {object} template The template.
	 * @param {object} object The object to check against the template.
	 */
	checkSchemaAgainstTemplate: (template, object) => {
		// object can contain a subset of template properties but cannot contain any that template does not
		Object.keys(object).forEach(key => {
			if (isObject(template[key]) && isObject(object[key])) {
				objects.checkSchemaAgainstTemplate(template[key], object[key]);
			} else {
				if (undefined === template[key])
					throw new Error(`unknown '${key}' key in config`);

				if (!areCompatible(template[key], object[key]))
					throw new Error(`override '${key}' property has wrong type`);
			}
		});
	}
};

module.exports = objects;