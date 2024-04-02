import introcs
import math

class gameData:
	def __init__(self, id):
		self.id = id
		self.finished = False
		self.p1id = 0
		self.p2id = 0
		self.scorep1 = 0
		self.scorep2 = 0
		self.initial_angle = 0.0
		self.bradius = 0.5196152
		self.bpx = 0.0
		self.bpz = 0.0
		self.bvx = 0.0
		self.bvz = 0.0
		self.plx = -15.0
		self.plz = 0.0
		self.prx = 15
		self.prz = 0.0
		self.ms = 0.25
		self.sif = 1.1
		self.bv = introcs.Vector3(math.cos(0) * 0.25, 0, math.sin(0) * 0.25)

	