function EntityMapper() {
  this.entities = [];  // Linear mapping of all entities
  this.entityMap = {}; // Mapping of entities by component type.

  this.actions = [];
  this.actionHistory = [];
  this.actionHistoryLength = 0;

	this.createEntity = function (components, name, children, parentID) {
	  var entity = new Entity();
	  entity.ID = this.entities.length;
	  if (name) {
      entity.name = name;
    }
	  var that = this;
    components.forEach(function (component) {
      entity.components[component.name] = component;
      if (!that.entityMap[component.name]) {
        that.entityMap[component.name] = [];
      }
      that.entityMap[component.name].push(entity);
    });
    this.entities.push(entity);

    if (children) {
      this.bindToParent(entity, children);
    }

    if (parentID) {
      this.bindToParent(this.entities[parentID], this);
    }

    return entity;
  };
	
	this.injectComponents = function (entity, components) {
    var that = this;
    components.forEach(function (component) {
      entity.components[component.name] = component;
      if (!that.entityMap[component.name]) {
        that.entityMap[component.name] = [];
      }
      that.entityMap[component.name].push(entity);
    })
  };
	
	this.bindToParent = function (parent, children) {
	  var childrenComponent = parent.components[ComponentType.children];
	  if (!childrenComponent) {
	    childrenComponent = new ChildrenComponent();
    }
	  var parentComponent = new ParentComponent(parent.ID);
	  for (var i = 0; i < children.length; i ++) {
      var child = children[i];
      childrenComponent.children.push(child.ID);
      this.injectComponents(child, [parentComponent]);
    }
    this.injectComponents(parent, [childrenComponent]);
  };


  this.logEntities = function () {
    console.log(JSON.stringify(this.entities, null, '\t'));
  };
}