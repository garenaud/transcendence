import introcs
import math
import random

class gameData:
	def __init__(self, id):
		self.id = id
		self.finished = False
		self.p1id = ""
		self.p2id = ""
		self.scorep1 = 0
		self.scorep2 = 0
		self.initial_angle = random.uniform(45, 90)
		self.bradius = 0.5196152 # ball radius
		self.bpx = 0.0 # ball position x
		self.bpz = 0.0 # ball position z
		self.bv = introcs.Vector3(math.cos(self.initial_angle) * 0.25, 0, math.sin(self.initial_angle) * 0.25) # ball velocity
		self.bvx = self.bv.x # ball velocity x
		self.bvz = self.bv.z # ball velocity z
		self.plx = -15.0 # paddle left position x
		self.plz = 0.0 # paddle left position z
		self.prx = 15 # paddle right position x
		self.prz = 0.0 # paddle right position z
		self.ms = 0.25 # move speed
		self.sif = 1.1 # speed increase factor
